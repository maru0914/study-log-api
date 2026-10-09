import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { currentYearMonth, monthRange } from './month-range.js';

@Controller('study-logs')
export class StudyLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('yearMonth') yearMonth?: string) {
    // ① どの月かを決める
    const ym = yearMonth ?? currentYearMonth();
    const { from, to } = monthRange(ym);

    // ② その月の記録を、新しい順で取る
    const logs = await this.prisma.studyLog.findMany({
      where: { studiedAt: { gte: from, lt: to } },
      orderBy: { studiedAt: 'desc' },
    });

    // ③ 分を足す
    const totalMinutes = logs.reduce(
      (sum, log) => sum + log.durationMinutes,
      0,
    );

    // ④ 返す
    return { yearMonth: ym, totalMinutes, logs };
  }
}
