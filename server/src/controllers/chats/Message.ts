import { Request, Response } from 'express';
import { chats } from '../../entity/chats';
import { reservation } from '../../entity/reservation';
import { posts } from '../../entity/posts';
import { getRepository } from 'typeorm';

export = async (req: Request, res: Response) => {
  const id: number = Number(req.params.roomId);
  const chatRepository = getRepository(chats);
  const chat = await chatRepository
    .createQueryBuilder('chat')
    .select(['chat', 'reservation_id'])
    .where('chat.id = :id', { id })
    .getRawOne()
    .then((res: any) => {
      return {
        chat: JSON.parse(res.chat_chat),
        reservation_id: res.chat_reservation_id,
      };
    });

  const reservationRepository = getRepository(reservation);
  const post = await reservationRepository
    .createQueryBuilder('reservation')
    .leftJoinAndSelect('reservation.posts_id', 'posts_id')
    .where('reservation.id = :id', { id: chat.reservation_id })
    .getOne();

  const postRepository = getRepository(posts);
  const userId = await postRepository
    .createQueryBuilder('post')
    .select('users_id')
    .where('post.id = :id', { id: post?.posts_id.id })
    .getRawOne();

  res.status(200).json({ chat: chat.chat, post, userId });
};
