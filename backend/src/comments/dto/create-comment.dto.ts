import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  userId: number;

  @IsString()
  @Length(1, 2000)
  text: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
