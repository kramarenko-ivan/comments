import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  text?: string;
}
