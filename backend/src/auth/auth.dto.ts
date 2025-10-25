import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsEthereumAddress,
} from 'class-validator';

// Legacy DTOs (keeping for backward compatibility if needed)
export class LoginDto {
  @ApiProperty({ description: 'Email address' })
  email: string;
  @ApiProperty({ description: 'Password' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @ApiProperty({ description: 'Name' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;
}

// New Wallet Authentication DTOs
export class WalletAuthDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b8D7389C2F5Cf5e5e5',
  })
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({ description: 'Signed message signature' })
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty({ description: 'Original message that was signed' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'User name (optional for registration)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;
}

export class GetNonceDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b8D7389C2F5Cf5e5e5',
  })
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;
}

export class UpdateEmailDto {
  @ApiProperty({ description: 'New email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
