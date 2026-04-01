import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  projectId: string;

  @IsUUID()
  authorId: string;
}
