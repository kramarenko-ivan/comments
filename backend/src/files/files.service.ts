import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Files } from './files.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Comments } from '../comments/comments.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepo: Repository<Files>,
    @InjectRepository(Comments)
    private readonly commentsRepo: Repository<Comments>,
  ) {}

  async create(dto: CreateFileDto) {
    const comment = await this.commentsRepo.findOne({ where: { comment_id: dto.commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const file = this.filesRepo.create({
      comment,
      file_type: dto.file_type,
      file_path: dto.file_path,
      size: dto.size,
    });

    return this.filesRepo.save(file);
  }

  findAll() {
    return this.filesRepo.find({ relations: ['comment'] });
  }

  async findOne(file_id: number) {
    const file = await this.filesRepo.findOne({ where: { file_id }, relations: ['comment'] });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async update(file_id: number, dto: UpdateFileDto) {
    const file = await this.filesRepo.findOne({ where: { file_id }, relations: ['comment'] });
    if (!file) throw new NotFoundException('File not found');

    if (dto.commentId) {
      const comment = await this.commentsRepo.findOne({ where: { comment_id: dto.commentId } });
      if (!comment) throw new NotFoundException('Comment not found');
      file.comment = comment;
    }

    Object.assign(file, dto);
    return this.filesRepo.save(file);
  }

  async remove(file_id: number) {
    const file = await this.filesRepo.findOne({ where: { file_id } });
    if (!file) throw new NotFoundException('File not found');
    return this.filesRepo.remove(file);
  }
}
