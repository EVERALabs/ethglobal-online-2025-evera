import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsEthereumAddress,
  IsBoolean,
} from 'class-validator';

export class CreatePrivateWalletDto {
  @ApiProperty({ description: 'Public key of the wallet' })
  @IsString()
  @IsEthereumAddress()
  publicKey: string;

  @ApiProperty({ description: 'Private key of the wallet' })
  @IsString()
  privateKey: string;

  @ApiProperty({
    description: 'Tags associated with the wallet',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Notes about the wallet' })
  @IsString()
  notes: string;
}

export class UpdatePrivateWalletDto {
  @ApiProperty({
    description: 'Tags associated with the wallet',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Notes about the wallet', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateReservedWalletUserAccessDto {
  @ApiProperty({ description: 'User ID to grant access to' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Public key of the reserved wallet' })
  @IsString()
  @IsEthereumAddress()
  reservedWalletPublicKey: string;
}

export class UpdateReservedWalletUserAccessDto {
  @ApiProperty({ description: 'Whether the access is active', required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class ReservedWalletResponseDto {
  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  privateKey: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  notes: string;

  @ApiProperty({ type: [Object] })
  ReservedWalletUserAccess: {
    userId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

export class ReservedWalletUserAccessResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  reservedWalletPublicKey: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty()
  reservedWallet: {
    publicKey: string;
    tags: string[];
    notes: string;
  };
}
