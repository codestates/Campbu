import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import users from '../../entity/users';
import { likes } from '../../entity/likes';
import { generateToken } from '../jwt/GenerateToken';

interface loginType {
  email: string;
  password: string;
}

export = async (req: Request, res: Response) => {
  const { email, password }: loginType = req.body;
  const usersRepository = getRepository(users);
  const likesRepository = getRepository(likes);

  if (!email || !password) {
    return res.status(400).json({ message: 'Bad Request' });
  } else {
    const userInfo = await usersRepository.findOne({
      email: email,
      password: password,
    });

    if (userInfo) {
      const token = await generateToken(userInfo.email);
      const likesInfo = await likesRepository
        .createQueryBuilder('likes')
        .select('posts_id')
        .where('likes.users_id = :userId', { userId: userInfo.id })
        .getRawMany();
      const likesId = likesInfo.map((el) => {
        return el.posts_id;
      });

      return res.status(200).json({ user: userInfo, likes: likesId, token });
    } else {
      return res.status(404).json({ message: 'User not exists' });
    }
  }
};
