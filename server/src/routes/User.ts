import express from 'express';
const router = express.Router();
import signupController from '../controllers/user/Signup';
import loginController from '../controllers/user/Login';
import logoutController from '../controllers/user/Logout';
import likeController from '../controllers/user/Likes';
import reviewController from '../controllers/user/Reviews';
import kakaoController from '../controllers/user/Kakao';
import googleController from '../controllers/user/Google';

router.get('/signup/', signupController.get);
router.post('/signup', signupController.post);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.post('/like', likeController);
router.post('/review', reviewController);
router.get('/kakao', kakaoController.getUserInfo);
router.post('/kakao', kakaoController.token);
router.get('/google', googleController.getUserInfo);
router.post('/google', googleController.token);

export = router;
