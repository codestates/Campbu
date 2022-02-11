"use strict";
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
var typeorm_1 = require("typeorm");
var reservation_1 = require("../../entity/reservation");
var posts_1 = require("../../entity/posts");
var users_1 = __importDefault(require("../../entity/users"));
var chats_1 = require("../../entity/chats");
var AuthorizeToken_1 = require("../jwt/AuthorizeToken");
exports.default = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, userRepository, user, _a, posts_id, reservation_dates, postRepository, post, reservationRepository, reservationId, reservationInfo, postUserId, postUserInfo, chatRepository, date, chat;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                return [4 /*yield*/, (0, AuthorizeToken_1.authorizeToken)(req, res)];
            case 1:
                decoded = _b.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(users_1.default)];
            case 2:
                userRepository = _b.sent();
                return [4 /*yield*/, userRepository.findOne({ email: decoded.email })];
            case 3:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 4];
                res.status(401).json({ message: 'Unauthorized User' });
                return [3 /*break*/, 11];
            case 4:
                _a = req.body, posts_id = _a.posts_id, reservation_dates = _a.reservation_dates;
                if (!(posts_id === undefined || reservation_dates === undefined)) return [3 /*break*/, 5];
                res.status(400).json({ message: 'Bad Request' });
                return [3 /*break*/, 11];
            case 5:
                postRepository = (0, typeorm_1.getRepository)(posts_1.posts);
                return [4 /*yield*/, postRepository.findOne({ id: posts_id })];
            case 6:
                post = _b.sent();
                reservationRepository = (0, typeorm_1.getRepository)(reservation_1.reservation);
                return [4 /*yield*/, reservationRepository
                        .insert({
                        reservation_dates: reservation_dates,
                        reservation_status: 1,
                        users_id: user,
                        posts_id: post,
                    })
                        .then(function (res) {
                        return res.identifiers[0].id;
                    })];
            case 7:
                reservationId = _b.sent();
                return [4 /*yield*/, reservationRepository.findOne({
                        id: reservationId,
                    })];
            case 8:
                reservationInfo = _b.sent();
                return [4 /*yield*/, postRepository
                        .createQueryBuilder()
                        .select('users_id')
                        .where('posts.id = :id', { id: posts_id })
                        .getRawOne()
                        .then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, Object.values(res)[0]];
                        });
                    }); })];
            case 9:
                postUserId = _b.sent();
                return [4 /*yield*/, userRepository.findOne({ id: postUserId })];
            case 10:
                postUserInfo = _b.sent();
                chatRepository = (0, typeorm_1.getRepository)(chats_1.chats);
                date = Date();
                chat = JSON.stringify([
                    {
                        sender: user.nickname,
                        message: "".concat(user.nickname, "\uB2D8\uC774 \uBB3C\uD488\uC744 \uC608\uC57D\uD588\uC5B4\uC694. \uD655\uC778\uD574\uC8FC\uC138\uC694."),
                        date: date,
                    },
                ]);
                chatRepository.insert({
                    recipient_nickname: postUserInfo === null || postUserInfo === void 0 ? void 0 : postUserInfo.nickname,
                    recipient_img: postUserInfo === null || postUserInfo === void 0 ? void 0 : postUserInfo.users_img,
                    sender_nickname: user === null || user === void 0 ? void 0 : user.nickname,
                    sender_img: user === null || user === void 0 ? void 0 : user.users_img,
                    chat: chat,
                    users_id: user,
                    reservation_id: reservationInfo,
                });
                res.status(201).json({ message: 'Reservation Successfully Created' });
                _b.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); });
