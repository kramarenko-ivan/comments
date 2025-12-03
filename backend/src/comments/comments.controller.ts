import {Controller, Post, Get, Delete, Body, Param, Patch, Query} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {UpdateCommentDto} from "./dto/update-comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get('tree')
  findAllTree() {
    return this.commentsService.findTree();
  }

  @Get(':comment_id/tree')
  findOneTree(@Param('comment_id') comment_id: number) {
    return this.commentsService.findOneTree(comment_id);
  }

  @Patch(':comment_id')
  update(
    @Param('comment_id') comment_id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(comment_id, dto);
  }

  @Delete(':comment_id')
  delete(@Param('comment_id') comment_id: number) {
    return this.commentsService.delete(comment_id);
  }

  @Get('sorted')
  getComments(
    @Query('sortBy') sortBy: 'username' | 'email' | 'comment_created',
    @Query('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
  ) {
    const pageNumber = parseInt(page);
    return this.commentsService.getComments(pageNumber, sortBy, order);
  }

}
