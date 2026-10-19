import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class QueryTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
