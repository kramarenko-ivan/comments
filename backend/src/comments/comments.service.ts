import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Comments } from './comments.entity';
import { Users } from '../users/users.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import {UpdateCommentDto} from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepo: TreeRepository<Comments>,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async create(dto: CreateCommentDto) {
    const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentsRepo.create({
      text: dto.text,
      user,
    });

    if (dto.parentId) {
      const parent = await this.commentsRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent comment not found');

      comment.parent = parent;
    }

    return this.commentsRepo.save(comment);
  }

  async findTree() {
    return this.commentsRepo.findTrees();
  }

  async findOneTree(id: number) {
    const root = await this.commentsRepo.findOne({ where: { id } });
    if (!root) throw new NotFoundException('Comment not found');

    return this.commentsRepo.findDescendantsTree(root);
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    Object.assign(comment, dto);
    return this.commentsRepo.save(comment);
  }

  async delete(id: number) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.commentsRepo.remove(comment);
  }
}
