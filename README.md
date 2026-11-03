# study-log-api

学習記録の JSON API です。Laravel＋Inertia で作った自作アプリ [agahh](https://github.com/maru0914/agahh) の StudyLog（学習記録）の機能を、画面ではなく JSON の API として、NestJS 12 と Prisma 7 で書き直しています（書き直しの途中）。

- **できること**: 学習記録の登録・一覧・1件の取得・更新・削除（トークンで認証し、他の人の記録は見えない・変えられない）。
- **なぜ書き直したか**: ふだん Laravel で書いている作り（FormRequest・値オブジェクト・ルートモデルバインディングなど）が、TypeScript と NestJS ではどうなるかを、同じ機能で1つずつ比べるため（下の対応表）。
- **テストと CI**: 単体テスト6件・e2e テスト19件。push のたびに GitHub Actions で型チェック（tsc）・lint（oxlint）・テストを回しています。

## 動かし方

```sh
npm install
npm run start:dev   # http://localhost:3000
npm test            # 単体テスト
npm run test:e2e    # e2e テスト
```

## Laravel ↔ NestJS 対応表

右の列は、書き直す前の Laravel のコード（agahh）です。

| Laravel                                                                         | NestJS                                                                                              | このリポジトリの場所                                                        | 元の Laravel のコード（agahh）                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ServiceProvider（部品を登録する所）                                             | Module（`@Module`）                                                                                 | src/app.module.ts                                                           | [AppServiceProvider.php](https://github.com/maru0914/agahh/blob/9475a30/app/Providers/AppServiceProvider.php)                                                                                                                                                             |
| Controller                                                                      | Controller（`@Controller`・`@Get`）                                                                 | src/app.controller.ts                                                       | [StudyLogController.php](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php)                                                                                                                                                      |
| サービスクラス                                                                  | Service（`@Injectable`）                                                                            | src/app.service.ts                                                          | —                                                                                                                                                                                                                                                                         |
| Pest の it / expect                                                             | Vitest の describe / it / expect                                                                    | src/study-logs/duration.spec.ts                                             | [StudyLogTest.php](https://github.com/maru0914/agahh/blob/9475a30/tests/Feature/StudyLogTest.php)、学習時間の計算は [StudyLogController.php の store](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php#L96)                     |
| migration と Eloquent モデル（php artisan migrate）                             | schema.prisma の model（npx prisma migrate dev）                                                    | prisma/schema.prisma                                                        | [create_study_logs_table.php](https://github.com/maru0914/agahh/blob/9475a30/database/migrations/2025_08_15_140019_create_study_logs_table.php)、[StudyLog.php](https://github.com/maru0914/agahh/blob/9475a30/app/Models/StudyLog.php)                                   |
| サービスコンテナ（コンストラクタで受け取る）                                    | DI（module の providers に登録して constructor で受け取る）                                         | src/app.module.ts、src/study-logs/study-logs.controller.ts                  | [AppServiceProvider.php](https://github.com/maru0914/agahh/blob/9475a30/app/Providers/AppServiceProvider.php)                                                                                                                                                             |
| whereBetween・orderByDesc・sum                                                  | findMany の where（gte・lt）と orderBy、配列の reduce                                               | src/study-logs/study-logs.controller.ts                                     | [StudyLogController.php の index](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php#L19-L36)                                                                                                                                     |
| 値オブジェクト（final class・private constructor・fromString）                  | class・private constructor・static fromString。形の違う値は BadRequestException で400               | src/value-objects/year-month.ts、src/study-logs/study-logs.controller.ts    | [YearMonth.php](https://github.com/maru0914/agahh/blob/9475a30/app/ValueObjects/YearMonth.php)、[YearMonthTest.php](https://github.com/maru0914/agahh/blob/9475a30/tests/Unit/ValueObject/YearMonthTest.php)                                                              |
| FormRequest の rules()（StoreRequest）と `$request->validated()`                | DTO クラスに class-validator のデコレータ、ValidationPipe（whitelist）                              | src/study-logs/dto/create-study-log.dto.ts、src/main.ts                     | [StoreRequest.php の rules()](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Requests/StudyLog/StoreRequest.php#L12-L21)、[StudyLogController.php の store](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php#L80-L102) |
| FormRequest の withValidator の after()（時間帯の重なり）と422                  | 保存の前に count で重なる行を数え、UnprocessableEntityException を throw                            | src/study-logs/study-logs.controller.ts                                     | [StoreRequest.php の withValidator](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Requests/StudyLog/StoreRequest.php#L23-L51)                                                                                                                                   |
| ルートモデルバインディング（show の StudyLog $studyLog）と、見つからなければ404 | @Param と ParseIntPipe で id を数にして受け取り、findUnique が null なら NotFoundException を throw | src/study-logs/study-logs.controller.ts                                     | [StudyLogController.php の show](https://github.com/maru0914/agahh/blob/9475a30/app/Http/Controllers/StudyLogController.php#L107-L130)                                                                                                                                    |
| auth:sanctum ミドルウェア（トークンで本人を確かめ、無ければ401）                | Guard（CanActivate）を @UseGuards で付け、見つけた User を request.user に入れる                    | src/auth/api-token.guard.ts、src/study-logs/study-logs.controller.ts        | —                                                                                                                                                                                                                                                                         |
| `$request->user()` と Policy（他人の記録は見つからない扱い）                    | createParamDecorator で作った @CurrentUser()、where に userId を足し null なら404                   | src/auth/current-user.decorator.ts、src/study-logs/study-logs.controller.ts | —                                                                                                                                                                                                                                                                         |

## API の仕様（openapi.json）

`npm run openapi` で、コード（DTO とコントローラー）から openapi.json を書き出しています（@nestjs/swagger の CLI プラグインで、DTO の項目と必須を読みます）。前の職場では逆に、OpenAPI の仕様を先に人が書き、実装がずれていないかを Dredd で確かめていました。どちらを選ぶかは、実装の進め方で決めます。バックエンドを先に作るならコードから書き出すほうがよく、バックエンドとフロントエンドを並行して作るなら、仕様が先にあったほうが進めやすいと考えています。今は受け取る側（リクエスト）の形だけを書いていて、返す側は型の無いオブジェクトなので、仕様には `type: object` としか出ません。

## 次にやる作業

- 次: 23回目 前の openapi.json と比べて、API を壊していないかを oasdiff で確かめる
