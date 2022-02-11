import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { reservation } from '../../entity/reservation';
import { posts } from '../../entity/posts';
import users from '../../entity/users';
import { chats } from '../../entity/chats';
import { authorizeToken } from '../jwt/AuthorizeToken';

export default async (req: Request, res: Response) => {
  interface reservationType {
    posts_id: number;
    reservation_dates: string[];
  }
  const decoded = await authorizeToken(req, res);
  const userRepository = await getRepository(users);
  const user = await userRepository.findOne({ email: decoded.email });

  if (!user) {
    res.status(401).json({ message: 'Unauthorized User' });
  } else {
    const { posts_id, reservation_dates }: reservationType = req.body;

    if (posts_id === undefined || reservation_dates === undefined) {
      res.status(400).json({ message: 'Bad Request' });
    } else {
      const postRepository = getRepository(posts);
      const post = await postRepository.findOne({ id: posts_id });

      const reservationRepository = getRepository(reservation);
      const reservationId = await reservationRepository
        .insert({
          reservation_dates,
          reservation_status: 1,
          users_id: user,
          posts_id: post,
        })
        .then((res) => {
          return res.identifiers[0].id;
        });

      const reservationInfo = await reservationRepository.findOne({
        id: reservationId,
      });

      const postUserId = await postRepository
        .createQueryBuilder()
        .select('users_id')
        .where('posts.id = :id', { id: posts_id })
        .getRawOne()
        .then(async (res: Response) => {
          return Object.values(res)[0];
        });

      const postUserInfo = await userRepository.findOne({ id: postUserId });

      const chatRepository = getRepository(chats);
      const date = Date();
      const chat = JSON.stringify([
        {
          sender: user.nickname,
          message: `${user.nickname}님이 물품을 예약했어요. 확인해주세요.`,
          date,
        },
      ]);
      chatRepository.insert({
        recipient_nickname: postUserInfo?.nickname,
        recipient_img: postUserInfo?.users_img,
        sender_nickname: user?.nickname,
        sender_img: user?.users_img,
        chat: chat,
        users_id: user,
        reservation_id: reservationInfo,
      });

      res.status(201).json({ message: 'Reservation Successfully Created' });
    }
  }
};
