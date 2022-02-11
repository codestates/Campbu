import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { likes } from './likes';
import { reservation } from './reservation';
import users from './users';

@Entity()
export class posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  deposit: number;

  @Column()
  rental_fee: number;

  @Column('simple-array')
  unavailable_dates: string[];

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column()
  address: string;

  @Column('simple-array')
  img_urls: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((type) => likes, (likes) => likes.posts_id)
  likes: likes[];

  @OneToMany((type) => reservation, (reservation) => reservation.posts_id)
  reservation: reservation[];

  @ManyToOne((type) => users, (users) => users.posts, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
  })
  users_id: users;
}
