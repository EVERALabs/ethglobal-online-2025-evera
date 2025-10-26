import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';

export class GraphQLQueryDto {
  @ApiProperty({
    description: 'GraphQL query string',
    example: 'query { users { id name email } }',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'GraphQL query variables (optional)',
    example: { limit: 10, offset: 0 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  variables?: Record<string, any>;

  @ApiProperty({
    description: 'Operation name (optional)',
    example: 'GetUsers',
    required: false,
  })
  @IsOptional()
  @IsString()
  operationName?: string;

  @ApiProperty({
    description: 'Cache TTL (optional)',
    example: 60000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ttl?: number;
}

export class GraphQLResponseDto {
  @ApiProperty({
    description: 'GraphQL response data',
    example: { users: [{ id: '1', name: 'John', email: 'john@example.com' }] },
  })
  data?: any;

  @ApiProperty({
    description: 'GraphQL errors (if any)',
    example: [
      { message: 'Field not found', locations: [{ line: 1, column: 1 }] },
    ],
    required: false,
  })
  errors?: any[];

  @ApiProperty({
    description: 'Additional extensions (optional)',
    required: false,
  })
  extensions?: any;
}
