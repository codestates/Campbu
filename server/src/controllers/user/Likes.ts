import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import users from '../../entity/users';
import { likes } from '../../entity/likes';
import { posts } from '../../entity/posts';
import { authorizeToken } from '../jwt/AuthorizeToken';

export default async (req: Request, res: Response) => {
  const post_id: number = req.body.post_id;
  const decoded = await authorizeToken(req, res);
  const usersRepository = getRepository(users);
  const likesRepository = getRepository(likes);
  const postsRepository = getRepository(posts);

  if (!post_id) {
    return res.status(400).json({ message: 'Bad Request' });
  } else {
    const userInfo = await usersRepository.findOne({
      email: decoded.email,
    });
    const postInfo = await postsRepository.findOne({
      id: post_id,
    });
    if (!userInfo) {
      return res.status(401).json({ message: 'Unauthorzied User' });
    } else {
      const likesExist = await likesRepository.findOne({
        users_id: userInfo,
        posts_id: postInfo,
      });
      if (likesExist) {
        await likesRepository.delete({
          users_id: userInfo,
          posts_id: postInfo,
        });
      } else {
        likesRepository.insert({
          users_id: userInfo,
          posts_id: postInfo,
        });
      }
      return res.status(201).json({ message: 'Like Successfully Updated' });
    }
  }
};
