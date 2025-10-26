import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PrivateWalletService } from './privatewallet.service';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import {
  CreatePrivateWalletDto,
  UpdatePrivateWalletDto,
  CreateReservedWalletUserAccessDto,
  UpdateReservedWalletUserAccessDto,
  ReservedWalletResponseDto,
  ReservedWalletUserAccessResponseDto,
} from './admin.dto';

@Controller('admin')
@ApiTags('Admin - Private Wallets')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly privateWalletService: PrivateWalletService) {}

  // Private Wallet CRUD Operations
  @Post('private-wallets')
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new private wallet' })
  @ApiResponse({
    status: 201,
    description: 'Private wallet created successfully',
    type: ReservedWalletResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Wallet with this public key already exists',
  })
  async createPrivateWallet(
    @Body() createPrivateWalletDto: CreatePrivateWalletDto,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id;

    return this.privateWalletService.createPrivateWallet(
      createPrivateWalletDto,
      adminUserId,
    );
  }

  @Get('private-wallets')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all private wallets accessible to the admin' })
  @ApiResponse({
    status: 200,
    description: 'List of private wallets',
    type: [ReservedWalletResponseDto],
  })
  async getPrivateWallets(@User() user) {
    const adminUserId = user.id;
    return this.privateWalletService.getPrivateWallets(adminUserId);
  }

  @Get('private-wallets/:publicKey')
  @Roles('admin')
  @ApiOperation({ summary: 'Get a specific private wallet by public key' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiResponse({
    status: 200,
    description: 'Private wallet details',
    type: ReservedWalletResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this wallet' })
  async getPrivateWallet(
    @Param('publicKey') publicKey: string,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id;
    return this.privateWalletService.getPrivateWallet(publicKey, adminUserId);
  }

  @Put('private-wallets/:publicKey')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a private wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiResponse({
    status: 200,
    description: 'Private wallet updated successfully',
    type: ReservedWalletResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this wallet' })
  async updatePrivateWallet(
    @Param('publicKey') publicKey: string,
    @Body() updatePrivateWalletDto: UpdatePrivateWalletDto,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id;
    return this.privateWalletService.updatePrivateWallet(
      publicKey,
      updatePrivateWalletDto,
      adminUserId,
    );
  }

  @Delete('private-wallets/:publicKey')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a private wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiResponse({
    status: 204,
    description: 'Private wallet deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this wallet' })
  async deletePrivateWallet(
    @Param('publicKey') publicKey: string,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id;
    return this.privateWalletService.deletePrivateWallet(
      publicKey,
      adminUserId,
    );
  }

  // Reserved Wallet User Access Operations
  @Post('private-wallets/:publicKey/access')
  @Roles('admin')
  @ApiOperation({ summary: 'Grant access to a private wallet for a user' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiResponse({
    status: 201,
    description: 'Access granted successfully',
    type: ReservedWalletUserAccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet or user not found' })
  @ApiResponse({
    status: 409,
    description: 'User already has access to this wallet',
  })
  async grantWalletAccess(
    @Param('publicKey') publicKey: string,
    @Body() createAccessDto: CreateReservedWalletUserAccessDto,
    @User('id') adminUserId: string,
  ) {
    // Ensure the publicKey in the URL matches the DTO
    const accessDto = {
      ...createAccessDto,
      reservedWalletPublicKey: publicKey,
    };
    return this.privateWalletService.grantWalletAccess(accessDto, adminUserId);
  }

  @Get('private-wallets/:publicKey/access')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all access records for a private wallet' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiResponse({
    status: 200,
    description: 'List of access records',
    type: [ReservedWalletUserAccessResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 403, description: 'Access denied to this wallet' })
  async getWalletAccesses(
    @Param('publicKey') publicKey: string,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id;
    return this.privateWalletService.getWalletAccesses(publicKey, adminUserId);
  }

  @Put('private-wallets/:publicKey/access/:userId')
  @Roles('admin')
  @ApiOperation({ summary: 'Update access record for a user' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Access record updated successfully',
    type: ReservedWalletUserAccessResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet, user, or access record not found',
  })
  @ApiResponse({ status: 403, description: 'Access denied to this wallet' })
  async updateWalletAccess(
    @Param('publicKey') publicKey: string,
    @Param('userId') userId: string,
    @Body() updateAccessDto: UpdateReservedWalletUserAccessDto,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id as string;
    return this.privateWalletService.updateWalletAccess(
      userId,
      publicKey,
      updateAccessDto,
      adminUserId,
    );
  }

  @Delete('private-wallets/:publicKey/access/:userId')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke access to a private wallet for a user' })
  @ApiParam({ name: 'publicKey', description: 'Public key of the wallet' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 204, description: 'Access revoked successfully' })
  @ApiResponse({
    status: 404,
    description: 'Wallet, user, or access record not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied or cannot revoke own access as sole admin',
  })
  async revokeWalletAccess(
    @Param('publicKey') publicKey: string,
    @Param('userId') userId: string,
    @User() adminUser,
  ) {
    const adminUserId = adminUser.id as string;
    return this.privateWalletService.revokeWalletAccess(
      userId,
      publicKey,
      adminUserId,
    );
  }
}
