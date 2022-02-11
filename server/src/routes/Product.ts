import express from 'express';
const router = express.Router();
import address from '../controllers/product/Address';
import post from '../controllers/product/Post';

router.get('/address/:addressId', address);
router.get('/post/:postId', post.get);
router.delete('/post/:postId', post.delete);

export default router;
