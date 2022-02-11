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
import { reservation } from './reservation';

@Entity()
export class chats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipient_nickname: string;

  @Column({ nullable: true })
  recipient_img: string;

  @Column()
  sender_nickname: string;

  @Column({ nullable: true })
  sender_img: string;

  @Column('mediumtext')
  chat: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => users, (users) => users.chats, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id',
  })
  users_id: users;

  @ManyToOne((type) => reservation, (reservation) => reservation.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'reservation_id',
    referencedColumnName: 'id',
  })
  reservation_id: reservation;
}
