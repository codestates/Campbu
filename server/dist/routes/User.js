"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var router = express.Router();
var Signup_1 = __importDefault(require("../controllers/user/Signup"));
var Login_1 = __importDefault(require("../controllers/user/Login"));
var Logout_1 = __importDefault(require("../controllers/user/Logout"));
var Likes_1 = __importDefault(require("../controllers/user/Likes"));
var Reviews_1 = __importDefault(require("../controllers/user/Reviews"));
var Kakao_1 = __importDefault(require("../controllers/user/Kakao"));
var Google_1 = __importDefault(require("../controllers/user/Google"));
router.get('/signup/', Signup_1.default.get);
router.post('/signup', Signup_1.default.post);
router.post('/login', Login_1.default);
router.get('/logout', Logout_1.default);
router.post('/like', Likes_1.default);
router.post('/review', Reviews_1.default);
router.get('/kakao', Kakao_1.default.getUserInfo);
router.post('/kakao', Kakao_1.default.token);
router.get('/google', Google_1.default.getUserInfo);
router.post('/google', Google_1.default.token);
exports.default = router;
