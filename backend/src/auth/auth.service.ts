import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomAlphaNumeric } from 'src/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // Legacy email/password authentication (keeping for backward compatibility)
  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.prisma.user.findFirst({ where: { email } });
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      walletAddress: user.walletAddress,
      lastNonce: user.lastNonce,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: user.walletAddress,
        lastNonce: user.lastNonce,
      },
    };
  }

  // async register(email: string, password: string, name?: string) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = await this.prisma.user.create({
  //     data: {
  //       email,
  //       password: hashedPassword,
  //       name,
  //       role: 'user',
  //     },
  //   });

  //   const { password: _, ...result } = user;
  //   return result;
  // }

  // New wallet-based authentication methods
  async generateNonce(walletAddress: string): Promise<string> {
    try {
      let nonce = generateRandomAlphaNumeric(10);
      const normalizedAddress = walletAddress.toLowerCase();

      // Check if user exists, if not create a temporary record with nonce
      const existingUser = await this.prisma.user.findUnique({
        where: { walletAddress: normalizedAddress },
      });

      if (existingUser) {
        // Update existing user's nonce
        await this.prisma.user.update({
          where: { walletAddress: normalizedAddress },
          data: { lastNonce: nonce.toString() },
        });
        console.log(`Updated nonce for existing user: ${normalizedAddress}`);
      } else {
        // Create new user record with nonce (will be completed during wallet auth)
        try {
          await this.prisma.user.create({
            data: {
              walletAddress: normalizedAddress,
              lastNonce: nonce.toString(),
              role: 'user',
            },
          });
          console.log(`Created new user record for: ${normalizedAddress}`);
        } catch (createError) {
          // Handle potential race condition where user was created between findUnique and create
          if (createError.code === 'P2002') {
            // Prisma unique constraint error
            console.log(
              `User already exists (race condition), updating nonce for: ${normalizedAddress}`,
            );
            await this.prisma.user.update({
              where: { walletAddress: normalizedAddress },
              data: { lastNonce: nonce.toString() },
            });
          } else {
            console.error('Error creating user record:', createError);
            throw new BadRequestException(
              'Failed to create user record for wallet authentication',
            );
          }
        }
      }

      return nonce.toString();
    } catch (error) {
      console.error('Error generating nonce:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to generate nonce for wallet authentication',
      );
    }
  }

  async verifySignature(
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  extractWalletAddressFromSiweMessage(message: string): string {
    // Extract wallet address from SIWE message
    // SIWE format: "domain wants you to sign in with your Ethereum account:\n{address}\n\n..."
    const addressMatch = message.match(/0x[a-fA-F0-9]{40}/);
    if (!addressMatch) {
      throw new BadRequestException(
        'Invalid SIWE message format: no wallet address found',
      );
    }
    return addressMatch[0];
  }

  extractNonceFromSiweMessage(message: string): string {
    // Extract nonce from SIWE message
    // Look for "Nonce: {nonce}" pattern
    const nonceMatch = message.match(/Nonce:\s*([^\n\r]+)/);
    if (!nonceMatch) {
      throw new BadRequestException(
        'Invalid SIWE message format: no nonce found',
      );
    }
    return nonceMatch[1].trim();
  }

  async authenticateWallet(signature: string, message: string) {
    // Extract wallet address from the SIWE message
    const walletAddress = this.extractWalletAddressFromSiweMessage(message);

    // Verify the signature
    const isValidSignature = await this.verifySignature(
      walletAddress,
      signature,
      message,
    );
    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Extract nonce from message and verify it matches the user's stored nonce
    const messageNonce = this.extractNonceFromSiweMessage(message);

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please request a nonce first.',
      );
    }

    // Verify that the nonce in the message matches the stored nonce
    if (messageNonce !== user.lastNonce) {
      throw new UnauthorizedException('Invalid or expired nonce');
    }

    // Update user's last login
    const updatedUser = await this.prisma.user.update({
      where: { walletAddress: walletAddress.toLowerCase() },
      data: {
        lastLogin: new Date(),
      },
    });

    return this.login(updatedUser);
  }

  async updateUserEmail(userId: string, email: string) {
    // Check if email is already taken by another user
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email is already in use by another account');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { email },
    });

    const { ...result } = updatedUser;
    return result;
  }

  generateSiweMessage(walletAddress: string, nonce: string): string {
    const domain = process.env.FRONTEND_URL || 'localhost:3000';
    const uri = process.env.FRONTEND_URL || 'http://localhost:3000';

    return `${domain} wants you to sign in with your Ethereum account:
${walletAddress}

Welcome to Evera! Please sign this message to authenticate.

URI: ${uri}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`;
  }
}
