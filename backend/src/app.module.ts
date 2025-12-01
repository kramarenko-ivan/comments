import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { Comments } from './comments/comments.entity';
import { Files } from './files/files.entity';
import {CommentsModule} from "./comments/comments.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // db for docker, localhost for local connection (backend in local, db in docker)
      port: 3306,
      username: 'root',
      password: 'secret',
      database: 'comments_db',
      entities: [Users, Comments, Files],
      synchronize: true, // ⚠️ never turn at prod
    }),
    TypeOrmModule.forFeature([Users, Comments, Files]),
    UsersModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
