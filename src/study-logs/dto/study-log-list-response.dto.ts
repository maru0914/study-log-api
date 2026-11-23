import { StudyLogResponseDto } from './study-log-response.dto.js';

export class StudyLogListResponseDto {
  yearMonth: string;
  totalMinutes: number;
  logs: StudyLogResponseDto[];
}
