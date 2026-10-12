import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { YearMonth } from '../value-objects/year-month.js';
import { durationMinutes } from './duration.js';
import { CreateStudyLogDto } from './dto/create-study-log.dto.js';

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

  // ① 受け取る（DTO の決まりを通った本文だけが dto に来る）
  @Post()
  async create(@Body() dto: CreateStudyLogDto) {
    // ② 日付と時刻をつないで、始めと終わりの日時と、分を作る
    const startedAt = new Date(`${dto.studiedAt}T${dto.startedTime}:00Z`);
    const endedAt = new Date(`${dto.studiedAt}T${dto.endedTime}:00Z`);
    const minutes = durationMinutes(dto.startedTime, dto.endedTime);

    // ③ 時間帯が重なる記録があれば、422で断る
    const overlaps = await this.prisma.studyLog.count({
      where: {
        userId: 1,
        startedAt: {
          lt: endedAt,
        },
        endedAt: {
          gt: startedAt,
        },
      },
    });

    if (overlaps > 0) {
      throw new UnprocessableEntityException(
        '選択した時間帯は既存の学習と重複しています。',
      );
    }

    // ④ 保存して、保存した1件を返す
    return this.prisma.studyLog.create({
      data: {
        userId: 1, // ログインは14回目。それまでは 1 で固定
        studiedAt: new Date(dto.studiedAt),
        startedAt,
        endedAt,
        subject: dto.subject,
        durationMinutes: minutes,
        notes: dto.notes,
      },
    });
  }
  // ① URL の :id を受け取る — URL から届くのは文字列なので、数に変えてから DB に渡す
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // ② その id の1件を取る（無ければ null）
    const log = await this.prisma.studyLog.findUnique({ where: { id } });

    // ③ 無ければ404で断る
    // 〔イ〕log が null なら、NotFoundException を throw する
    if (log === null) {
      throw new NotFoundException('学習記録が見つかりません。');
    }

    // ④ 返す

    return log;
  }
}
