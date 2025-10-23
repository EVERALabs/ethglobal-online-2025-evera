import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ description: 'User Id' })
  id: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Name' })
  name: string;

  @ApiProperty({ description: 'Role' })
  role: string;

  createdAt: Date;
  updatedAt: Date;
}
