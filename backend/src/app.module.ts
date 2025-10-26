import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NoteSampleListener } from './events/noteSample.listener';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      // 2. The useFactory logic is now much simpler
      useFactory: async (configService: ConfigService) => {
        const useRedis = configService.get<string>('USE_REDIS') === 'true';
        const redisUri = configService.get<string>('REDIS_URI');

        // If not using Redis, return an empty object for default in-memory cache
        if (!useRedis || !redisUri) {
          console.log('Using in-memory cache');
          return { store: 'memory' };
        }

        console.log('Using Redis cache');

        // 3. Return the store configuration correctly
        return {
          stores: await redisStore({
            url: redisUri,
            // Optional: set a default TTL (Time To Live) in milliseconds
            ttl: 60 * 1000, // 60 seconds
          }),
        };
      },
    }),
    EventEmitterModule.forRoot(),
    StorageModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    NotesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    NoteSampleListener,
  ],
})
export class AppModule {}
