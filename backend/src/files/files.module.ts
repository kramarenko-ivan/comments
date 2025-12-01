import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './files.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Comments } from '../comments/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Files, Comments])],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
