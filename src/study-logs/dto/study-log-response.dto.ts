// 返す側の1件の形（24回目）。デコレーターは書かない（CLI プラグインが型から仕様を付ける）
export class StudyLogResponseDto {
  id: number;
  studiedAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  durationMinutes: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
