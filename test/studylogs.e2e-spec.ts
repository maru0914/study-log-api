import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma.service.js';

describe('GET /study-logs (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // RefreshDatabase に当たる: 表を空にする（dev.db の中身も消える）
    prisma = app.get(PrismaService);
    await prisma.studyLog.deleteMany();

    // ファクトリに当たる: 2件入れる
    await prisma.studyLog.createMany({
      data: [
        {
          userId: 1,
          studiedAt: new Date('2026-10-01'),
          subject: 'NestJS',
          durationMinutes: 60,
        },
        {
          userId: 1,
          studiedAt: new Date('2026-10-02'),
          subject: 'Prisma',
          durationMinutes: 30,
        },
      ],
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('2件入れると2件返る', async () => {
    const response = await request(app.getHttpServer())
      .get('/study-logs?yearMonth=202610')
      .expect(200);

    expect(response.body.logs).toHaveLength(2);
  });

  it('今月の60分と30分で totalMinutes が 90、前月の1件は一覧に入らない', async () => {
    await prisma.studyLog.create({
      data: {
        userId: 1,
        studiedAt: new Date('2026-09-30'),
        subject: 'TypeScript',
        durationMinutes: 45,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/study-logs?yearMonth=202610')
      .expect(200);

    expect(response.body.totalMinutes).toBe(90);
    expect(response.body.logs).toHaveLength(2);
    expect(response.body.logs[0].subject).toBe('Prisma');
  });
});
