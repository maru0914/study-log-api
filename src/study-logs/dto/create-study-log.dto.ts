import {
  isDateString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// agahh の app/Http/Requests/StudyLog/StoreRequest.php の rules() を移したもの。
// POST /study-logs で受け取る JSON の形と、その決まり。
export class CreateStudyLogDto {
  // ① 日付
  @IsDateString()
  studiedAt: string;

  // ② 科目
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  // ③ 始めと終わりの時刻
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startedTime: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endedTime: string;

  // ④ メモ（無くてもよい） ④ 書かない日もあるので無くてよい。デコレータを付けないと whitelist で捨てられるので、@IsOptional() だけでも付ける
  @IsOptional()
  @IsString()
  notes?: string;
}
