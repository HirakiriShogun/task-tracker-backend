import { IsUUID } from 'class-validator';

export class AddUserToWorkspaceDto {
  @IsUUID()
  userId: string;
}
