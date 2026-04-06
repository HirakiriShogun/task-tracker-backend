import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsOptional()
  creatorId?: string;
}
