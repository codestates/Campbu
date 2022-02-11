"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var Address_1 = __importDefault(require("../controllers/product/Address"));
var Post_1 = __importDefault(require("../controllers/product/Post"));
router.get('/address/:addressId', Address_1.default);
router.get('/post/:postId', Post_1.default.get);
router.delete('/post/:postId', Post_1.default.delete);
exports.default = router;
