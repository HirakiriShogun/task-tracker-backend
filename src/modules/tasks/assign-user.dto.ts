import { IsUUID } from 'class-validator';

export class AssignUserDto {
  @IsUUID()
  assigneeId: string;
}
