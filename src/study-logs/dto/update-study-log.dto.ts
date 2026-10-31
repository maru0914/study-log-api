import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyLogDto } from './create-study-log.dto.js';
export class UpdateStudyLogDto extends PartialType(CreateStudyLogDto) {}
