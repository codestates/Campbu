import { Request, Response } from 'express';
import { authorizeToken } from '../jwt/AuthorizeToken';
import { chats } from '../../entity/chats';
import users from '../../entity/users';
import { getRepository } from 'typeorm';

export default async (req: Request, res: Response) => {
  const decoded = await authorizeToken(req, res);
  const userRepository = await getRepository(users);
  const user = await userRepository.findOne({ email: decoded.email });

  if (!user) {
    res.status(401).json({ message: 'Unauthorized User' });
  } else {
    const chatRepository = await getRepository(chats);
    const chat = await chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.reservation_id', 'reservation')
      .where('chat.recipient_nickname = :reNick', { reNick: user.nickname })
      .orWhere('chat.sender_nickname = :seNick', { seNick: user.nickname })
      .getMany();

    res.status(200).json({ chat, nickName: user.nickname });
  }
};
