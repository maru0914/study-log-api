import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { YearMonth } from '../value-objects/year-month.js';

@Controller('study-logs')
export class StudyLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('yearMonth') yearMonth?: string) {
    // ① どの月かを決める
    let ym: YearMonth;
    try {
      ym = yearMonth ? YearMonth.fromString(yearMonth) : YearMonth.current();
    } catch {
      throw new BadRequestException(
        'yearMonth は YYYYMM の形で指定してください（例: 202610）',
      );
    }
    const from = ym.toDate();
    const to = ym.next().toDate();

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
    return { yearMonth: ym.toString(), totalMinutes, logs };
  }
}
