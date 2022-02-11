import express from 'express';
const router = express.Router();
import ChatRoom from '../controllers/chats/ChatRoom';
import Message from '../controllers/chats/Message';

router.get('/chatRoom', ChatRoom);
router.get('/message/:roomId', Message);

export default router;
