import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Controller('study-logs')
export class StudyLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return await this.prisma.studyLog.findMany();
  }
}
