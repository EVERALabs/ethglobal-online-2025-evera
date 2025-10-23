import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

async function workerBootstrap() {
  const useWorker = process.env.USE_WORKER === 'true';
  if (!useWorker) return;

  const logger = new Logger('Application Worker');
}

workerBootstrap();
