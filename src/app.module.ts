import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { StudyLogsController } from './study-logs/study-logs.controller.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [],
  controllers: [AppController, StudyLogsController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
