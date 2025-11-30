import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Comments } from '../comments/comments.entity';

export enum FileType {
  IMAGE = 'image',
  TEXT = 'text',
}

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comments;

  @Column({ type: 'enum', enum: FileType })
  file_type: FileType;

  @Column({ length: 255 })
  file_path: string;

  @Column('int')
  size: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;
}
