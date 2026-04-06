import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  taskId: string;

  @IsUUID()
  @IsOptional()
  authorId?: string;
}
