import { DataSource } from 'typeorm';
import { Users } from './users/users.entity';
import { Comments } from './comments/comments.entity';
import * as dotenv from 'dotenv';
import {Files} from "./files/files.entity";
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'secret',
  database: 'comments_db',
  entities: [Users, Comments, Files],
  migrations: ['./migrations/*.ts'],
  synchronize: false,
});
