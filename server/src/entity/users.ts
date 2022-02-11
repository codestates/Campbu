import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { likes } from './likes';
import { posts } from './posts';
import { reservation } from './reservation';
import { users_reviews } from './users_reviews';
import { chats } from './chats';

@Entity()
export default class users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  users_img: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToMany((type) => likes, (likes) => likes.users_id)
  likes: likes[];

  @OneToMany((type) => users_reviews, (users_reviews) => users_reviews.users_id)
  users_reviews: users_reviews[];

  @OneToMany((type) => posts, (posts) => posts.users_id)
  posts: posts[];

  @OneToMany((type) => reservation, (reservation) => reservation.users_id)
  reservation: reservation[];

  @OneToMany((type) => chats, (chats) => chats.users_id)
  chats: chats[];
}
