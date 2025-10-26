import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  Query,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { WalletAuthDto, GetNonceDto, UpdateEmailDto } from './auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // New wallet-based authentication endpoints
  @Public()
  @Get('nonce')
  @ApiOperation({ summary: 'Get nonce for wallet authentication' })
  @ApiResponse({
    status: 200,
    description: 'Returns nonce and SIWE message for signing',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid wallet address or failed to generate nonce',
  })
  async getNonce(@Query() getNonceDto: GetNonceDto) {
    try {
      const nonce = await this.authService.generateNonce(
        getNonceDto.walletAddress,
      );
      const message = this.authService.generateSiweMessage(
        getNonceDto.walletAddress,
        nonce,
      );

      return {
        nonce,
        message,
        walletAddress: getNonceDto.walletAddress,
        success: true,
      };
    } catch (error) {
      console.error('Error in getNonce endpoint:', error);
      throw error; // Re-throw to let NestJS handle the HTTP response
    }
  }

  @Public()
  @Post('wallet')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login/Register with Ethereum wallet' })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with wallet',
  })
  @ApiResponse({ status: 401, description: 'Invalid signature or nonce' })
  async walletAuth(@Body() walletAuthDto: WalletAuthDto) {
    return this.authService.authenticateWallet(
      walletAuthDto.signature,
      walletAuthDto.message,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user email address' })
  @ApiResponse({ status: 200, description: 'Email updated successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async updateEmail(@Request() req, @Body() updateEmailDto: UpdateEmailDto) {
    return this.authService.updateUserEmail(req.user.id, updateEmailDto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      walletAddress: req.user.walletAddress,
      role: req.user.role,
    };
  }
}
