import type { StudyLog } from '../generated/prisma/client.js';

export function toResponse(log: StudyLog): Omit<StudyLog, 'userId'> {
  const { userId: _userId, ...rest } = log;
  return rest;
}
