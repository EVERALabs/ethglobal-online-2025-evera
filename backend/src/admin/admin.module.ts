import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrivateWalletService } from './privatewallet.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [PrivateWalletService],
  exports: [],
})
export class AdminModule {}
