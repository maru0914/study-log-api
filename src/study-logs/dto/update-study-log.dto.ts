import { PartialType } from '@nestjs/swagger';
import { CreateStudyLogDto } from './create-study-log.dto.js';
export class UpdateStudyLogDto extends PartialType(CreateStudyLogDto) {}
