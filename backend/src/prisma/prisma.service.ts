import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    let log = [];
    if (process.env.PRISMA_DEBUG === 'true') {
      log = [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ];
    }

    super({
      log,
    });
  }

  async onModuleInit() {
    this.$on('query', (e: Prisma.QueryEvent) => {
      this.logger.debug(`Query: ${e.query} | ${e.params} | ${e.duration}ms`);
    });
    this.$on('info', (e: Prisma.LogEvent) => {
      this.logger.debug(e.message);
    });
    this.$on('warn', (e: Prisma.LogEvent) => {
      this.logger.debug(e.message);
    });
    this.$on('error', (e: Prisma.LogEvent) => {
      this.logger.error(e.message);
    });

    await this.$connect();
  }

  async paginate<WhereType, OrderType>(
    model: string,
    page: number = 1,
    pageSize: number = 10,
    where?: WhereType,
    order?: OrderType,
    include?: any,
  ): Promise<{
    results: any[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    const [results, totalRecords] = await this.$transaction([
      this[model].findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: order,
        include: include,
      }),
      this[model].count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
      results,
      totalRecords,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }

  async paginateQuery(
    query: string,
    page: number = 1,
    pageSize: number = 10,
    params: any[] = [],
  ): Promise<{
    results: any[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const [results, totalRecords] = await this.$transaction([
      this.$queryRawUnsafe(
        `${query} LIMIT ${limit} OFFSET ${offset}`,
        ...params,
      ),
      this.$queryRawUnsafe(
        `SELECT COUNT(*) as total FROM (${query}) AS subquery`,
        ...params,
      ),
    ]);

    const total = parseInt(totalRecords[0].total);
    const totalPages = Math.ceil(total / pageSize);

    return {
      results: results as any[],
      totalRecords: total,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }
}
