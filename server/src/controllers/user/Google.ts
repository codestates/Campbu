import axios from 'axios';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import users from '../../entity/users';
import { likes } from '../../entity/likes';
import { generateToken } from '../jwt/GenerateToken';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  token: async (req: Request, res: Response) => {
    const URL = 'https://oauth2.googleapis.com/token';
    const code = req.body.authorizationCode;
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
    const grant_type = 'authorization_code';

    await axios
      .post(URL, { code, client_id, client_secret, redirect_uri, grant_type })
      .then((response) => res.send(response.data));
  },
  getUserInfo: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    await axios
      .get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { authorization: `Bearer ${token} ` },
      })
      .then(async (response) => {
        const usersRepository = getRepository(users);
        const likesRepository = getRepository(likes);
        const email = response.data.email;
        const nickname = response.data.name;
        const users_img = response.data.picture;

        const userInfo = await usersRepository.findOne({ email: email });
        if (!userInfo) {
          await usersRepository.insert({
            email: email,
            nickname: nickname,
            users_img: users_img,
          });
          const accessToken = await generateToken(email);
          const userInfo = await usersRepository.findOne({
            email: email,
          });
          return res.status(201).json({ user: userInfo, token: accessToken });
        } else {
          await usersRepository.update(
            {
              email: email,
            },
            { nickname: nickname, users_img: users_img },
          );
          const accessToken = await generateToken(email);
          const userInfo = await usersRepository.findOne({
            email: email,
          });
          const likesInfo = await likesRepository
            .createQueryBuilder('likes')
            .select('posts_id')
            .where('likes.users_id = :userId', {
              userId: userInfo?.id,
            })
            .getRawMany();
          const likesId = likesInfo.map((el) => {
            return el.posts_id;
          });
          return res
            .status(200)
            .json({ user: userInfo, likes: likesId, token: accessToken });
        }
      });
  },
};
