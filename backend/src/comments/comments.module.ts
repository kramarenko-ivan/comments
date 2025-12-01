import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './comments.entity';
import { Users } from '../users/users.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Users])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
