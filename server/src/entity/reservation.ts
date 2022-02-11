import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import users from './users';
import { posts } from './posts';
import { chats } from './chats';

@Entity()
export class reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  reservation_dates: string[];

  @Column()
  reservation_status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => users, (users) => users.reservation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
  })
  users_id: users;

  @ManyToOne((type) => posts, (posts) => posts.reservation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'posts_id',
    referencedColumnName: 'id',
  })
  posts_id: posts;

  @OneToMany((type) => chats, (chats) => chats.reservation_id)
  chats: chats[];
}
