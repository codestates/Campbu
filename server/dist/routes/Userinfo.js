"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var account_1 = __importDefault(require("../controllers/userinfo/account"));
var product_1 = __importDefault(require("../controllers/userinfo/product"));
var router = express_1.default.Router();
router.get('/account', account_1.default.get);
router.get('/product/borrow', product_1.default.borrow);
router.get('/product/lend', product_1.default.lend);
router.get('/product/like', product_1.default.like);
router.get('/product/post', product_1.default.post);
router.patch('/account', account_1.default.patch);
router.delete('/account', account_1.default.delete);
exports.default = router;
