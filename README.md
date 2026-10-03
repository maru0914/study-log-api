# study-log-api

学習記録の JSON API です。Laravel＋Inertia で作った自作アプリ（非公開）の StudyLog（学習記録）の機能を、画面ではなく JSON の API として、NestJS 12 と Prisma 7 で書き直しています（書き直しの途中）。

## 動かし方

```sh
npm install
npm run start:dev   # http://localhost:3000
npm test            # 単体テスト
npm run test:e2e    # e2e テスト
```

## Laravel ↔ NestJS 対応表

| Laravel                             | NestJS                              | このリポジトリの場所            |
| ----------------------------------- | ----------------------------------- | ------------------------------- |
| ServiceProvider（部品を登録する所） | Module（`@Module`）                 | src/app.module.ts               |
| Controller                          | Controller（`@Controller`・`@Get`） | src/app.controller.ts           |
| サービスクラス                      | Service（`@Injectable`）            | src/app.service.ts              |
| Pest の it / expect                 | Vitest の describe / it / expect    | src/study-logs/duration.spec.ts |
