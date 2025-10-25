import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ethers } from 'ethers';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const nonce = nanoid(16);

    // Check if user exists, if not create a temporary record with nonce
    const existingUser = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (existingUser) {
      // Update existing user's nonce
      await this.prisma.user.update({
        where: { walletAddress: walletAddress.toLowerCase() },
        data: { lastNonce: nonce },
      });
    } else {
      // Create new user record with nonce (will be completed during wallet auth)
      await this.prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          lastNonce: nonce,
          role: 'user',
        },
      });
    }

    return nonce;
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

  async authenticateWallet(
    walletAddress: string,
    signature: string,
    message: string,
    name?: string,
  ) {
    // Verify the signature
    const isValidSignature = await this.verifySignature(
      walletAddress,
      signature,
      message,
    );
    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Check if the message contains the expected nonce
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User not found. Please request a nonce first.',
      );
    }

    // Verify that the message contains the user's nonce
    if (!message.includes(user.lastNonce)) {
      throw new UnauthorizedException('Invalid nonce in message');
    }

    // Update user's last login and name if provided
    const updatedUser = await this.prisma.user.update({
      where: { walletAddress: walletAddress.toLowerCase() },
      data: {
        lastLogin: new Date(),
        ...(name && { name }),
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
