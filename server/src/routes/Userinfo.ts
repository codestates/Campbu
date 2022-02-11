import express from 'express';
import accountController from '../controllers/userinfo/account';
import productController from '../controllers/userinfo/product';
const router = express.Router();

router.get('/account', accountController.get);
router.get('/product/borrow', productController.borrow);
router.get('/product/lend', productController.lend);
router.get('/product/like', productController.like);
router.get('/product/post', productController.post);
router.patch('/account', accountController.patch);
router.delete('/account', accountController.delete);

export default router;
