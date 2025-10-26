import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { IndexerService } from './indexer.service';
import { GraphQLQueryDto, GraphQLResponseDto } from './indexer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('indexer')
@ApiTags('Indexer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class IndexerController {
  private readonly logger = new Logger(IndexerController.name);
  constructor(
    private readonly indexerService: IndexerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post('query/cached')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'user')
  @ApiOperation({
    summary: 'Execute GraphQL query against the Envio indexer',
    description:
      'Proxy GraphQL queries to the Envio indexer and return the results',
  })
  @ApiBody({
    type: GraphQLQueryDto,
    description: 'GraphQL query with optional variables and operation name',
    examples: {
      simpleQuery: {
        summary: 'Simple query example',
        value: {
          query: 'query { users { id name email } }',
        },
      },
      queryWithVariables: {
        summary: 'Query with variables example',
        value: {
          query: 'query GetUser($id: ID!) { user(id: $id) { id name email } }',
          variables: { id: '1' },
          operationName: 'GetUser',
        },
      },
    },
  })
  async executeQueryCached(
    @Body() queryDto: GraphQLQueryDto,
  ): Promise<GraphQLResponseDto> {
    const cachedResult = await this.cacheManager.get(queryDto.query);
    if (cachedResult) {
      this.logger.debug(`Cached result found for query: ${queryDto.query}`);
      return cachedResult as GraphQLResponseDto;
    }
    const result = await this.indexerService.executeGraphQLQuery(queryDto);
    await this.cacheManager.set(
      queryDto.query,
      result,
      queryDto.ttl ?? 60 * 1000,
    );
    return result;
  }

  @Post('query')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'user')
  @ApiOperation({
    summary: 'Execute GraphQL query against the Envio indexer',
    description:
      'Proxy GraphQL queries to the Envio indexer and return the results',
  })
  @ApiBody({
    type: GraphQLQueryDto,
    description: 'GraphQL query with optional variables and operation name',
    examples: {
      simpleQuery: {
        summary: 'Simple query example',
        value: {
          query: 'query { users { id name email } }',
        },
      },
      queryWithVariables: {
        summary: 'Query with variables example',
        value: {
          query: 'query GetUser($id: ID!) { user(id: $id) { id name email } }',
          variables: { id: '1' },
          operationName: 'GetUser',
        },
      },
    },
  })
  async executeQuery(
    @Body() queryDto: GraphQLQueryDto,
  ): Promise<GraphQLResponseDto> {
    return this.indexerService.executeGraphQLQuery(queryDto);
  }

  @Get('health')
  @Roles('admin', 'user')
  @ApiOperation({
    summary: 'Check indexer service health',
    description: 'Verify that the Envio indexer is accessible and responding',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check completed',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['healthy', 'unhealthy'],
          description: 'Current health status of the indexer',
        },
        indexerUrl: {
          type: 'string',
          description: 'The URL of the Envio indexer being used',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async healthCheck(): Promise<{ status: string; indexerUrl: string }> {
    return this.indexerService.healthCheck();
  }
}
