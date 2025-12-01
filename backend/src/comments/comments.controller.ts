import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get()
  findAllTree() {
    return this.commentsService.findTree();
  }

  @Get(':id/tree')
  findOneTree(@Param('id') id: number) {
    return this.commentsService.findOneTree(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }
}
