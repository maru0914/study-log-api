import type { StudyLog } from '../generated/prisma/client.js';
import { StudyLogResponseDto } from './dto/study-log-response.dto.js';

export function toResponse(log: StudyLog): StudyLogResponseDto {
  const { userId: _userId, ...rest } = log;
  return rest;
}
