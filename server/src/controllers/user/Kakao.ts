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
    const code = req.body.authorizationCode;
    const REST_API_KEY = process.env.KAKAO_API_KEY;
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

    axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .then((response) => res.send(response.data));
  },
  getUserInfo: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    axios
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          authorization: `Bearer ${token} `,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then(async (response) => {
        const usersRepository = getRepository(users);
        const likesRepository = getRepository(likes);
        const email = response.data.kakao_account.email;
        const nickname = response.data.kakao_account.profile.nickname;
        const users_img =
          response.data.kakao_account.profile.thumbnail_image_url;

        const userInfo = await usersRepository.findOne({
          email: email,
        });
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
