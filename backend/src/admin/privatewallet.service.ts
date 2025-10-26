import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePrivateWalletDto,
  UpdatePrivateWalletDto,
  CreateReservedWalletUserAccessDto,
  UpdateReservedWalletUserAccessDto,
} from './admin.dto';

@Injectable()
export class PrivateWalletService {
  constructor(private readonly prisma: PrismaService) {}

  // Private Wallet CRUD Operations
  async createPrivateWallet(
    createPrivateWalletDto: CreatePrivateWalletDto,
    adminUserId: string,
  ) {
    try {
      // Check if wallet already exists
      const existingWallet = await this.prisma.reservedWallet.findUnique({
        where: { publicKey: createPrivateWalletDto.publicKey },
      });

      if (existingWallet) {
        throw new ConflictException(
          'Wallet with this public key already exists',
        );
      }

      // Create the wallet
      const wallet = await this.prisma.reservedWallet.create({
        data: {
          publicKey: createPrivateWalletDto.publicKey,
          privateKey: createPrivateWalletDto.privateKey,
          tags: createPrivateWalletDto.tags,
          notes: createPrivateWalletDto.notes,
          ReservedWalletUserAccess: {
            create: {
              userId: adminUserId,
              active: true,
            },
          },
        },
        include: {
          ReservedWalletUserAccess: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return wallet;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create private wallet: ${error.message}`);
    }
  }

  async getPrivateWallets(adminUserId: string) {
    const wallets = await this.prisma.reservedWallet.findMany({
      where: {
        ReservedWalletUserAccess: {
          some: {
            userId: adminUserId,
            active: true,
          },
        },
      },
      include: {
        ReservedWalletUserAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return wallets;
  }

  async getPrivateWallet(publicKey: string, adminUserId: string) {
    const wallet = await this.prisma.reservedWallet.findUnique({
      where: { publicKey },
      include: {
        ReservedWalletUserAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if admin has access to this wallet
    const hasAccess = wallet.ReservedWalletUserAccess.some(
      (access) => access.userId === adminUserId && access.active,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this wallet');
    }

    return wallet;
  }

  async updatePrivateWallet(
    publicKey: string,
    updatePrivateWalletDto: UpdatePrivateWalletDto,
    adminUserId: string,
  ) {
    // First check if wallet exists and user has access
    await this.getPrivateWallet(publicKey, adminUserId);

    const updatedWallet = await this.prisma.reservedWallet.update({
      where: { publicKey },
      data: {
        ...(updatePrivateWalletDto.tags && {
          tags: updatePrivateWalletDto.tags,
        }),
        ...(updatePrivateWalletDto.notes && {
          notes: updatePrivateWalletDto.notes,
        }),
      },
      include: {
        ReservedWalletUserAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return updatedWallet;
  }

  async deletePrivateWallet(publicKey: string, adminUserId: string) {
    // First check if wallet exists and user has access
    await this.getPrivateWallet(publicKey, adminUserId);

    // Delete all access records first (due to foreign key constraints)
    await this.prisma.reservedWalletUserAccess.deleteMany({
      where: { reservedWalletPublicKey: publicKey },
    });

    // Then delete the wallet
    await this.prisma.reservedWallet.delete({
      where: { publicKey },
    });

    return { message: 'Wallet deleted successfully' };
  }

  // Reserved Wallet User Access Operations
  async grantWalletAccess(
    createAccessDto: CreateReservedWalletUserAccessDto,
    adminUserId: string,
  ) {
    // Check if admin has access to this wallet
    await this.getPrivateWallet(
      createAccessDto.reservedWalletPublicKey,
      adminUserId,
    );

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createAccessDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if access already exists
    const existingAccess =
      await this.prisma.reservedWalletUserAccess.findUnique({
        where: {
          userId_reservedWalletPublicKey: {
            userId: createAccessDto.userId,
            reservedWalletPublicKey: createAccessDto.reservedWalletPublicKey,
          },
        },
      });

    if (existingAccess) {
      // If exists but inactive, reactivate it
      if (!existingAccess.active) {
        return await this.prisma.reservedWalletUserAccess.update({
          where: {
            userId_reservedWalletPublicKey: {
              userId: createAccessDto.userId,
              reservedWalletPublicKey: createAccessDto.reservedWalletPublicKey,
            },
          },
          data: { active: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            reservedWallet: {
              select: {
                publicKey: true,
                tags: true,
                notes: true,
              },
            },
          },
        });
      }
      throw new ConflictException('User already has access to this wallet');
    }

    // Create new access
    const access = await this.prisma.reservedWalletUserAccess.create({
      data: {
        userId: createAccessDto.userId,
        reservedWalletPublicKey: createAccessDto.reservedWalletPublicKey,
        active: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        reservedWallet: {
          select: {
            publicKey: true,
            tags: true,
            notes: true,
          },
        },
      },
    });

    return access;
  }

  async getWalletAccesses(publicKey: string, adminUserId: string) {
    // Check if admin has access to this wallet
    await this.getPrivateWallet(publicKey, adminUserId);

    const accesses = await this.prisma.reservedWalletUserAccess.findMany({
      where: { reservedWalletPublicKey: publicKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        reservedWallet: {
          select: {
            publicKey: true,
            tags: true,
            notes: true,
          },
        },
      },
    });

    return accesses;
  }

  async updateWalletAccess(
    userId: string,
    publicKey: string,
    updateAccessDto: UpdateReservedWalletUserAccessDto,
    adminUserId: string,
  ) {
    // Check if admin has access to this wallet
    await this.getPrivateWallet(publicKey, adminUserId);

    const access = await this.prisma.reservedWalletUserAccess.findUnique({
      where: {
        userId_reservedWalletPublicKey: {
          userId,
          reservedWalletPublicKey: publicKey,
        },
      },
    });

    if (!access) {
      throw new NotFoundException('Access record not found');
    }

    const updatedAccess = await this.prisma.reservedWalletUserAccess.update({
      where: {
        userId_reservedWalletPublicKey: {
          userId,
          reservedWalletPublicKey: publicKey,
        },
      },
      data: updateAccessDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        reservedWallet: {
          select: {
            publicKey: true,
            tags: true,
            notes: true,
          },
        },
      },
    });

    return updatedAccess;
  }

  async revokeWalletAccess(
    userId: string,
    publicKey: string,
    adminUserId: string,
  ) {
    // Check if admin has access to this wallet
    await this.getPrivateWallet(publicKey, adminUserId);

    // Don't allow admin to revoke their own access if they're the only one with access
    if (userId === adminUserId) {
      const activeAccesses = await this.prisma.reservedWalletUserAccess.count({
        where: {
          reservedWalletPublicKey: publicKey,
          active: true,
        },
      });

      if (activeAccesses <= 1) {
        throw new ForbiddenException(
          'Cannot revoke your own access as you are the only admin with access to this wallet',
        );
      }
    }

    const access = await this.prisma.reservedWalletUserAccess.findUnique({
      where: {
        userId_reservedWalletPublicKey: {
          userId,
          reservedWalletPublicKey: publicKey,
        },
      },
    });

    if (!access) {
      throw new NotFoundException('Access record not found');
    }

    await this.prisma.reservedWalletUserAccess.delete({
      where: {
        userId_reservedWalletPublicKey: {
          userId,
          reservedWalletPublicKey: publicKey,
        },
      },
    });

    return { message: 'Access revoked successfully' };
  }
}
