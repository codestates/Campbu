import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import users from '../../entity/users';
import { users_reviews } from '../../entity/users_reviews';
import { reviews } from '../../entity/reviews';
import { authorizeToken } from '../jwt/AuthorizeToken';

export default async (req: Request, res: Response) => {
  const user_id = req.body.user_id;
  const review_id: number[] = req.body.review_id;
  const decoded = await authorizeToken(req, res);
  const usersRepository = getRepository(users);
  const userReviewsRepository = getRepository(users_reviews);
  const reviewsRepository = getRepository(reviews);

  if (!review_id) {
    return res.status(400).json({ message: 'Bad Request' });
  } else {
    const userInfo = await usersRepository.findOne({
      email: decoded.email,
    });
    const reviewInfo = await Promise.all(
      review_id.map(async (data: number) => {
        return await reviewsRepository.findOne({
          id: data,
        });
      }),
    );
    if (!userInfo) {
      return res.status(401).json({ message: 'Unauthorized User' });
    } else {
      reviewInfo.map(async (data) => {
        const reviewExist = await userReviewsRepository.findOne({
          users_id: user_id,
          reviews_id: data,
        });
        if (reviewExist) {
          await userReviewsRepository.increment(
            { reviews_id: data },
            'count',
            1,
          );
        } else {
          await userReviewsRepository.insert({
            users_id: user_id,
            reviews_id: data,
            count: 1,
          });
        }
      });
      return res.status(201).json({ message: 'Review Successfully added' });
    }
  }
};
