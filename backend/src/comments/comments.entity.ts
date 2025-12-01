import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('comments')
@Tree('closure-table') // поддержка древовидной структуры
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.comments, { nullable: false, onDelete: 'CASCADE' })
  user: Users;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Comments;

  @TreeChildren()
  children: Comments[];

  @Column('text')
  text: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
