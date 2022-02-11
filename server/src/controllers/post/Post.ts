import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { posts } from '../../entity/posts';
import users from '../../entity/users';
import { users_reviews } from '../../entity/users_reviews';
import { authorizeToken } from '../jwt/AuthorizeToken';
import axios from 'axios';

export default {
  get: async (req: Request, res: Response) => {
    const id: number = Number(req.params.postId);

    const decoded = await authorizeToken(req, res);
    const userRepository = await getRepository(users);
    const user = await userRepository.findOne({ email: decoded.email });

    if (!user) {
      res.status(401).json({ message: 'Unauthorized User' });
    } else {
      const postRepository = getRepository(posts);
      const post = await postRepository.findOne({ id: id });
      res.status(200).json({ posts: post, user });
    }
  },
  patch: async (req: Request, res: Response) => {
    interface postType {
      category: string;
      deposit: number;
      rental_fee: number;
      unavailable_dates: string[];
      title: string;
      content: string;
      address: string;
      img_urls: string[];
    }

    const id: number = Number(req.params.postId);

    const {
      category,
      deposit,
      rental_fee,
      unavailable_dates,
      title,
      content,
      address,
      img_urls,
    }: postType = req.body;

    const decoded = await authorizeToken(req, res);
    const userRepository = await getRepository(users);
    const user = await userRepository.findOne({ email: decoded.email });

    if (!user) {
      res.status(401).json({ message: 'Unauthorized User' });
    } else {
      const postRepository = getRepository(posts);
      const reviewRepository = getRepository(users_reviews);

      if (category) {
        await postRepository.update(id, { category });
      }
      if (deposit) {
        await postRepository.update(id, { deposit });
      }
      if (rental_fee) {
        await postRepository.update(id, { rental_fee });
      }
      if (unavailable_dates) {
        await postRepository.update(id, { unavailable_dates });
      }
      if (title) {
        await postRepository.update(id, { title });
      }
      if (content) {
        await postRepository.update(id, { content });
      }
      if (img_urls) {
        await postRepository.update(id, { img_urls });
      }
      if (address) {
        const coordinates = await axios
          .get('https://dapi.kakao.com/v2/local/search/address.json', {
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAOREST_API}`,
            },
            params: {
              query: address,
            },
          })
          .then((res) => {
            return res.data.documents[0];
          });
        await postRepository.update(id, {
          address,
          longitude: coordinates.x,
          latitude: coordinates.y,
        });
      }

      const userId = await userRepository
        .createQueryBuilder()
        .select('id')
        .where('users.email = :email', { email: decoded.email })
        .getRawOne()
        .then((res: Response) => {
          return Object.values(res)[0];
        });

      const post = await postRepository.findOne({ id });
      const reviews = await reviewRepository
        .createQueryBuilder()
        .select(['count', 'reviews_id'])
        .where('users_reviews.users_id = :users_id', { users_id: userId })
        .getRawMany();

      res.status(200).json({ posts: post, reviews });
    }
  },
};
