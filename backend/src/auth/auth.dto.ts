import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

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
