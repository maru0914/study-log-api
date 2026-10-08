import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client.js';

// DB につなぐ部品。Laravel の config/database.php と DB の接続に当たる
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? 'file:./dev.db',
    });
    super({ adapter });
  }
}
