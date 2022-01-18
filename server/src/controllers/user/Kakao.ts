import axios from 'axios';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { users } from '../../entity/users';
import { generateToken } from '../jwt/GenerateToken';

export default {
  token: async (req: Request, res: Response) => {
    const code = req.body.authorizationCode;
    const REST_API_KEY = 'b8665986f69d987ebb83449a6a9b06ba';
    const REDIRECT_URI = 'http://localhost:3000/oauth/kakao/callback';

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
          return res
            .status(201)
            .cookie('jwt', accessToken, { httpOnly: true })
            .json({ user: userInfo });
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
          return res
            .status(200)
            .cookie('jwt', accessToken, { httpOnly: true })
            .json({ user: userInfo });
        }
      });
  },
};
