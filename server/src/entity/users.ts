import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { likes } from './likes';
import { posts } from './posts';
import { reservation } from './reservation';
import { users_reviews } from './users_reviews';

@Entity()
export class users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column()
  users_img: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;

  @OneToMany((type) => likes, (likes) => likes.users)
  likes: likes[];

  @OneToMany((type) => users_reviews, (users_reviews) => users_reviews.users)
  users_reviews: users_reviews[];

  @OneToMany((type) => posts, (posts) => posts.users)
  posts: posts[];

  @OneToMany((type) => reservation, (reservation) => reservation.users)
  reservation: reservation[];
}
