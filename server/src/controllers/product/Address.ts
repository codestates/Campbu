import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import axios from 'axios';
import { posts } from '../../entity/posts';
import { users } from '../../entity/users';
import { likes } from '../../entity/likes';
import { authorizeToken } from '../jwt/AuthorizeToken';
const jwt = require('jsonwebtoken');

export = async (req: Request, res: Response) => {
  const address = req.params.addressId;

  const coordinates = await axios
    .get(`https://dapi.kakao.com/v2/local/search/address.json`, {
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

  if (coordinates === undefined) {
    res.status(400).json({ message: 'Bad Request' });
  } else {
    const entityManager = getManager();
    const distance = 2;
    const nearbyProduct = await entityManager
      .query(
        `
    SELECT id, (
      6371 * acos (
      cos ( radians(${Number(coordinates.y)}) )
      * cos( radians( latitude ) )
      * cos( radians( longitude ) - radians(${Number(coordinates.x)}) )
      + sin ( radians(${Number(coordinates.y)}) )
      * sin( radians( latitude ) )
      )
    ) AS distance
    FROM posts
    HAVING distance < ${distance}
    ORDER BY distance`,
      )
      .then((res: Response) => {
        return JSON.stringify(res);
      });

    if (JSON.parse(nearbyProduct).length === 0) {
      res.status(200).json({ posts: [] });
    } else {
      const nearbyProductId = JSON.parse(nearbyProduct).map(
        (product: object) => {
          return Object.values(product)[0];
        },
      );

      const post = await getRepository(posts)
        .createQueryBuilder('post')
        .loadRelationCountAndMap('post.likes_count', 'post.likes')
        .where('post.id IN (:...ids)', { ids: nearbyProductId })
        .getMany();

      if (req.headers.authorization !== 'Bearer') {
        const decoded = await authorizeToken(req, res);
        const userRepository = await getRepository(users);
        const userId = await userRepository
          .createQueryBuilder()
          .select('id')
          .where('users.email = :email', { email: decoded.email })
          .getRawOne()
          .then((res: Response) => {
            return Object.values(res)[0];
          });

        const likesRepository = await getRepository(likes);
        const like = await likesRepository
          .createQueryBuilder()
          .select('posts_id')
          .where('likes.users_id = :users_id', { users_id: userId })
          .getRawMany();

        res.status(200).json({ posts: post, likes: like });
      } else {
        res.status(200).json({ posts: post, likes: [] });
      }
    }
  }
};
