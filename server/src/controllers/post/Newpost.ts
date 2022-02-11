import { Request, Response } from 'express';
import axios from 'axios';
import { getRepository } from 'typeorm';
import { posts } from '../../entity/posts';
import users from '../../entity/users';
import { authorizeToken } from '../jwt/AuthorizeToken';

export default async (req: Request, res: Response) => {
  interface postType {
    category: string;
    deposit: number;
    rental_fee: number;
    unavailable_dates?: string[];
    title: string;
    content: string;
    address: string;
    img_urls: string[];
  }

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
    if (
      category === undefined ||
      deposit === undefined ||
      rental_fee === undefined ||
      unavailable_dates === undefined ||
      title === undefined ||
      content === undefined ||
      address === undefined ||
      img_urls === undefined
    ) {
      res.status(400).json({ message: 'Bad Request' });
    } else {
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
      const postRepository = getRepository(posts);
      await postRepository.insert({
        category,
        deposit,
        rental_fee,
        unavailable_dates,
        title,
        content,
        longitude: coordinates.x,
        latitude: coordinates.y,
        address,
        img_urls,
        users_id: user,
      });
      res.status(200).json({ message: 'Post Successfully Created' });
    }
  }
};
