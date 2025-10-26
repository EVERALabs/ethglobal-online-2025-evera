import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLQueryDto, GraphQLResponseDto } from './indexer.dto';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);
  private readonly indexerUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.indexerUrl = this.configService.get<string>('ENVIO_INDEXER_URL');

    if (!this.indexerUrl) {
      this.logger.error('ENVIO_INDEXER_URL environment variable is not set');
      throw new Error('ENVIO_INDEXER_URL environment variable is required');
    }

    this.logger.log(`Indexer service initialized with URL: ${this.indexerUrl}`);
  }

  async executeGraphQLQuery(
    queryDto: GraphQLQueryDto,
  ): Promise<GraphQLResponseDto> {
    try {
      this.logger.debug(`Executing GraphQL query: ${queryDto.query}`);

      // Validate that the query is not empty
      if (!queryDto.query || queryDto.query.trim().length === 0) {
        throw new BadRequestException('GraphQL query cannot be empty');
      }

      // Prepare the GraphQL request payload
      const payload = {
        query: queryDto.query,
        ...(queryDto.variables && { variables: queryDto.variables }),
        ...(queryDto.operationName && {
          operationName: queryDto.operationName,
        }),
      };

      this.logger.debug(
        `Sending request to indexer: ${JSON.stringify(payload)}`,
      );

      // Make the HTTP request to the Envio indexer
      const response = await fetch(this.indexerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the HTTP request was successful
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Indexer request failed with status ${response.status}: ${errorText}`,
        );
        throw new InternalServerErrorException(
          `Indexer request failed: ${response.status} ${response.statusText}`,
        );
      }

      // Parse the JSON response
      const result: GraphQLResponseDto = await response.json();

      this.logger.debug(
        `Received response from indexer: ${JSON.stringify(result)}`,
      );

      // Log GraphQL errors if present (but still return the response)
      if (result.errors && result.errors.length > 0) {
        this.logger.warn(
          `GraphQL errors in response: ${JSON.stringify(result.errors)}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error executing GraphQL query: ${error.message}`,
        error.stack,
      );

      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Handle network errors or other unexpected errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new InternalServerErrorException(
          'Failed to connect to the indexer service. Please check if the indexer is running.',
        );
      }

      // Generic error handling
      throw new InternalServerErrorException(
        'An unexpected error occurred while querying the indexer',
      );
    }
  }

  async healthCheck(): Promise<{ status: string; indexerUrl: string }> {
    try {
      // Simple health check query
      const healthQuery = {
        query: '{ __typename }',
      };

      const response = await fetch(this.indexerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(healthQuery),
      });

      if (response.ok) {
        return {
          status: 'healthy',
          indexerUrl: this.indexerUrl,
        };
      } else {
        return {
          status: 'unhealthy',
          indexerUrl: this.indexerUrl,
        };
      }
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      return {
        status: 'unhealthy',
        indexerUrl: this.indexerUrl,
      };
    }
  }
}
