import { Request, response, Response } from 'express';
import { posts } from '../../entity/posts';
import { users } from '../../entity/users';
import { users_reviews } from '../../entity/users_reviews';
import { getRepository } from 'typeorm';
import { authorizeToken } from '../jwt/AuthorizeToken';

export default {
  get: async (req: Request, res: Response) => {
    const id: number = Number(req.params.postId);
    const postRepository = getRepository(posts);
    const userRepository = getRepository(users);
    const reviewRepository = getRepository(users_reviews);

    const post = await postRepository
      .createQueryBuilder('post')
      .loadRelationCountAndMap('post.likes_count', 'post.likes')
      .where('post.id = :id', { id: id })
      .getOne();

    const userId = await postRepository
      .createQueryBuilder()
      .select('users_id')
      .where('posts.id = :id', { id: id })
      .getRawOne()
      .then(async (res: Response) => {
        return Object.values(res)[0];
      });

    const reviews = await reviewRepository
      .createQueryBuilder()
      .select(['count', 'reviews_id'])
      .where('users_reviews.users_id = :users_id', { users_id: userId })
      .getRawMany();

    const user = await userRepository.findOne({ id: userId });
    if (reviews === undefined || reviews === null) {
      res.status(200).json({ posts: post, reviews: [], user });
    } else {
      res.status(200).json({ posts: post, reviews, user });
    }
  },
  delete: async (req: Request, res: Response) => {
    const decoded = await authorizeToken(req, res);
    const userRepository = await getRepository(users);
    const user = await userRepository.findOne({ email: decoded.email });

    if (!user) {
      res.status(401).json({ message: 'Unauthorized User' });
    } else {
      const id: string = req.params.postId;
      const postRepository = getRepository(posts);
      await postRepository.delete({ id: Number(id) });
      res.status(200).json({ message: 'Product Post Successfully Deleted' });
    }
  },
};
