import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  creatorId: string;
}
