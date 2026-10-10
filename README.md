# study-log-api

学習記録の JSON API です。Laravel＋Inertia で作った自作アプリ [agahh](https://github.com/maru0914/agahh) の StudyLog（学習記録）の機能を、画面ではなく JSON の API として、NestJS 12 と Prisma 7 で書き直しています（書き直しの途中）。

## 動かし方

```sh
npm install
npm run start:dev   # http://localhost:3000
npm test            # 単体テスト
npm run test:e2e    # e2e テスト
```

## Laravel ↔ NestJS 対応表

右の列は、書き直す前の Laravel のコード（agahh）です。

| Laravel | NestJS | このリポジトリの場所 | 元の Laravel のコード（agahh） |
| --- | --- | --- | --- |
| ServiceProvider（部品を登録する所） | Module（`@Module`） | src/app.module.ts | [AppServiceProvider.php](https://github.com/maru0914/agahh/blob/9475a30/app/Providers/AppServiceProvider.php) |
| Controller | Controller（`@Controller`・`@Get`） | src/app.controller.ts | [StudyLogController.php](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php) |
| サービスクラス | Service（`@Injectable`） | src/app.service.ts | — |
| Pest の it / expect | Vitest の describe / it / expect | src/study-logs/duration.spec.ts | [StudyLogTest.php](https://github.com/maru0914/agahh/blob/9475a30/tests/Feature/StudyLogTest.php)、学習時間の計算は [StudyLogController.php の store](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php#L96) |
| migration と Eloquent モデル（php artisan migrate） | schema.prisma の model（npx prisma migrate dev） | prisma/schema.prisma | [create_study_logs_table.php](https://github.com/maru0914/agahh/blob/9475a30/database/migrations/2025_08_15_140019_create_study_logs_table.php)、[StudyLog.php](https://github.com/maru0914/agahh/blob/9475a30/app/Models/StudyLog.php) |
| サービスコンテナ（コンストラクタで受け取る） | DI（module の providers に登録して constructor で受け取る） | src/app.module.ts、src/study-logs/study-logs.controller.ts | [AppServiceProvider.php](https://github.com/maru0914/agahh/blob/9475a30/app/Providers/AppServiceProvider.php) |
| whereBetween・orderByDesc・sum | findMany の where（gte・lt）と orderBy、配列の reduce | src/study-logs/study-logs.controller.ts | [StudyLogController.php の index](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php#L19-L36) |
| 値オブジェクト（final class・private constructor・fromString） | class・private constructor・static fromString。形の違う値は BadRequestException で400 | src/value-objects/year-month.ts、src/study-logs/study-logs.controller.ts | [YearMonth.php](https://github.com/maru0914/agahh/blob/9475a30/app/ValueObjects/YearMonth.php)、[YearMonthTest.php](https://github.com/maru0914/agahh/blob/9475a30/tests/Unit/ValueObject/YearMonthTest.php) |
