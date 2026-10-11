import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma.service.js';

describe('/study-logs (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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

    expect(response.body.yearMonth).toBe('202610');
    expect(response.body.totalMinutes).toBe(90);
    expect(response.body.logs).toHaveLength(2);
    expect(response.body.logs[0].subject).toBe('Prisma');
  });
  it('yearMonth=2026-10 のように形が違うと400', async () => {
    const response = await request(app.getHttpServer())
      .get('/study-logs?yearMonth=2026-10')
      .expect(400);

    expect(response.body.message).toBe(
      'yearMonth は YYYYMM の形で指定してください（例: 202610）',
    );
  });

  // agahh の Pest『allows a user to create a study log』を移したもの
  it('10:00〜11:30 で登録すると201で、durationMinutes が 90', async () => {
    const response = await request(app.getHttpServer())
      .post('/study-logs')
      .send({
        studiedAt: '2026-10-11',
        subject: '数学 問題集',
        startedTime: '10:00',
        endedTime: '11:30',
        notes: '章末問題',
      })
      .expect(201);

    expect(response.body.durationMinutes).toBe(90);
    expect(response.body.notes).toBe('章末問題');

    // assertDatabaseHas に当たる: その行が DB に1件ある
    const count = await prisma.studyLog.count({
      where: { userId: 1, subject: '数学 問題集', durationMinutes: 90 },
    });
    expect(count).toBe(1);
  });

  // StoreRequest の 'subject' => ['required', …] に当たる
  it('subject が空なら400', async () => {
    const response = await request(app.getHttpServer())
      .post('/study-logs')
      .send({
        studiedAt: '2026-10-11',
        subject: '',
        startedTime: '10:00',
        endedTime: '11:30',
      })
      .expect(400);

    expect(response.body.message).toContain('subject should not be empty');
  });
});
