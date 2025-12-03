import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comments } from '../comments/comments.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 40, unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 40, nullable: true })
  homepage: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Comments, (comment) => comment.user, { cascade: ['remove'] })
  comments: Comments[];
}
