import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { FileType } from '../files.entity';

export class CreateFileDto {
  @IsInt()
  commentId: number;

  @IsEnum(FileType)
  file_type: FileType;

  @IsString()
  @IsNotEmpty()
  file_path: string;

  @IsInt()
  size: number;
}
