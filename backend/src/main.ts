import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Add BigInt serialization support
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  Decimal.prototype.toJSON = function () {
    return this.toNumber();
  };

  const appTitle = process.env.APP_TITLE || 'Backend Application';
  const appDescription =
    process.env.APP_DESCRIPTION || 'Just simple backend using NestJS';
  const appVersion = process.env.APP_VERSION || '1.0.0';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // document
  const documentConfig = new DocumentBuilder()
    .setTitle(appTitle)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const corsURLList = process.env.CORS_URL_LIST
    ? process.env.CORS_URL_LIST.split(',')
    : [];
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      ...corsURLList,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address

  await app.listen(process.env.PORT ?? 8008);
}
bootstrap();
