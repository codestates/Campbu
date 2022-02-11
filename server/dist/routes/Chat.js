"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var ChatRoom_1 = __importDefault(require("../controllers/chats/ChatRoom"));
var Message_1 = __importDefault(require("../controllers/chats/Message"));
router.get('/chatRoom', ChatRoom_1.default);
router.get('/message/:roomId', Message_1.default);
exports.default = router;
