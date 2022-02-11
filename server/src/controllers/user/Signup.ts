import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import users from '../../entity/users';

interface info {
  email: string;
  nickname: string;
}

export default {
  get: async (req: Request<{}, {}, {}, info>, res: Response) => {
    const { query } = req;
    const usersRepository = getRepository(users);

    if (query.email) {
      const userInfo = await usersRepository.findOne({ email: query.email });

      if (userInfo) {
        return res.status(409).json({ message: 'Email already exists' });
      } else {
        return res.status(200).json({ message: 'Avaliable Email' });
      }
    } else if (query.nickname) {
      const userInfo = await usersRepository.findOne({
        nickname: query.nickname,
      });

      if (userInfo) {
        return res.status(409).json({ message: 'Nickname already exists' });
      } else {
        return res.status(200).json({ message: 'Avaliable Nickname' });
      }
    }
  },
  post: async (req: Request, res: Response) => {
    interface signupType {
      email: string;
      nickname: string;
      password: string;
    }
    const { email, nickname, password }: signupType = req.body;
    const usersRepository = getRepository(users);

    if (!email || !nickname || !password) {
      return res.status(400).json({ message: 'Bad Request' });
    } else {
      const userInfo = await usersRepository.findOne({ email: email });

      if (userInfo) {
        return res.status(409).json({ message: 'Account already exists' });
      }
      await usersRepository.insert({
        email: email,
        nickname: nickname,
        password: password,
      });

      return res.status(201).json({ message: 'Create Successfully' });
    }
  },
};
