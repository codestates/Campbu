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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var typeorm_1 = require("typeorm");
var users_1 = __importDefault(require("../../entity/users"));
var likes_1 = require("../../entity/likes");
var GenerateToken_1 = require("../jwt/GenerateToken");
var dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.default = {
    token: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var code, REST_API_KEY, REDIRECT_URI;
        return __generator(this, function (_a) {
            code = req.body.authorizationCode;
            REST_API_KEY = process.env.KAKAO_API_KEY;
            REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
            axios_1.default
                .post("https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=".concat(REST_API_KEY, "&redirect_uri=").concat(REDIRECT_URI, "&code=").concat(code), {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            })
                .then(function (response) { return res.send(response.data); });
            return [2 /*return*/];
        });
    }); },
    getUserInfo: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var token;
        var _a;
        return __generator(this, function (_b) {
            token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            axios_1.default
                .get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    authorization: "Bearer ".concat(token, " "),
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            })
                .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
                var usersRepository, likesRepository, email, nickname, users_img, userInfo, accessToken, userInfo_1, accessToken, userInfo_2, likesInfo, likesId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            usersRepository = (0, typeorm_1.getRepository)(users_1.default);
                            likesRepository = (0, typeorm_1.getRepository)(likes_1.likes);
                            email = response.data.kakao_account.email;
                            nickname = response.data.kakao_account.profile.nickname;
                            users_img = response.data.kakao_account.profile.thumbnail_image_url;
                            return [4 /*yield*/, usersRepository.findOne({
                                    email: email,
                                })];
                        case 1:
                            userInfo = _a.sent();
                            if (!!userInfo) return [3 /*break*/, 5];
                            return [4 /*yield*/, usersRepository.insert({
                                    email: email,
                                    nickname: nickname,
                                    users_img: users_img,
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, GenerateToken_1.generateToken)(email)];
                        case 3:
                            accessToken = _a.sent();
                            return [4 /*yield*/, usersRepository.findOne({
                                    email: email,
                                })];
                        case 4:
                            userInfo_1 = _a.sent();
                            return [2 /*return*/, res.status(201).json({ user: userInfo_1, token: accessToken })];
                        case 5: return [4 /*yield*/, usersRepository.update({
                                email: email,
                            }, { nickname: nickname, users_img: users_img })];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, (0, GenerateToken_1.generateToken)(email)];
                        case 7:
                            accessToken = _a.sent();
                            return [4 /*yield*/, usersRepository.findOne({
                                    email: email,
                                })];
                        case 8:
                            userInfo_2 = _a.sent();
                            return [4 /*yield*/, likesRepository
                                    .createQueryBuilder('likes')
                                    .select('posts_id')
                                    .where('likes.users_id = :userId', {
                                    userId: userInfo_2 === null || userInfo_2 === void 0 ? void 0 : userInfo_2.id,
                                })
                                    .getRawMany()];
                        case 9:
                            likesInfo = _a.sent();
                            likesId = likesInfo.map(function (el) {
                                return el.posts_id;
                            });
                            return [2 /*return*/, res
                                    .status(200)
                                    .json({ user: userInfo_2, likes: likesId, token: accessToken })];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); },
};
