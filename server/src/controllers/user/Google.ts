import axios from 'axios';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { users } from '../../entity/users';
import { generateToken } from '../jwt/GenerateToken';

export default {
  token: async (req: Request, res: Response) => {
    const URL = 'https://oauth2.googleapis.com/token';
    const code = req.body.authorizationCode;
    const client_id =
      '494275960739-1v9pnkndic9jo598ba3hsakpulfscu6a.apps.googleusercontent.com';
    const client_secret = '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';
    const redirect_uri = 'http://localhost:3000/oauth/google/callback';
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
