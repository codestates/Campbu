import express from 'express';
const router = express.Router();
import newpost from '../controllers/post/Newpost';
import post from '../controllers/post/Post';

router.get('/:postId', post.get);
router.post('/newpost', newpost);
router.patch('/:postId', post.patch);

export default router;
