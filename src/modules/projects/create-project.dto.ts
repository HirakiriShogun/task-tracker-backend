import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  workspaceId: string;

  @IsUUID()
  @IsOptional()
  creatorId?: string;
}
