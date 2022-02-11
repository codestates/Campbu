import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import users from './users';
import { posts } from './posts';

@Entity()
export class likes {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => users, (users) => users.likes, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
  })
  users_id: users;

  @ManyToOne((type) => posts, (posts) => posts.likes, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'posts_id',
    referencedColumnName: 'id',
  })
  posts_id: posts;
}
