import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { reviews } from './reviews';
import users from './users';

@Entity()
export class users_reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => users, (users) => users.users_reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
  })
  users_id: users;

  @ManyToOne((type) => reviews, (reviews) => reviews.users_reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'reviews_id',
    referencedColumnName: 'id',
  })
  reviews_id: reviews;
}
