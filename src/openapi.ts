import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

// サーバーを立てずに（listen しない）、コントローラーと DTO から仕様を組み立ててファイルに書く。
const app = await NestFactory.create(AppModule, { logger: false });
const config = new DocumentBuilder()
  .setTitle('study-log-api')
  .setVersion('0.0.1')
  .build();
const document = SwaggerModule.createDocument(app, config);
writeFileSync('openapi.json', JSON.stringify(document, null, 2) + '\n');
await app.close();
