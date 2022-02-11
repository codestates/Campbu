"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var Newpost_1 = __importDefault(require("../controllers/post/Newpost"));
var Post_1 = __importDefault(require("../controllers/post/Post"));
router.get('/:postId', Post_1.default.get);
router.post('/newpost', Newpost_1.default);
router.patch('/:postId', Post_1.default.patch);
exports.default = router;
