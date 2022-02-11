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
var axios_1 = __importDefault(require("axios"));
var posts_1 = require("../../entity/posts");
var users_1 = __importDefault(require("../../entity/users"));
var likes_1 = require("../../entity/likes");
var AuthorizeToken_1 = require("../jwt/AuthorizeToken");
var jwt = require('jsonwebtoken');
exports.default = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var address, coordinates, entityManager, distance, nearbyProduct, nearbyProductId, post, decoded, userRepository, userId, likesRepository, like;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = req.params.addressId;
                return [4 /*yield*/, axios_1.default
                        .get("https://dapi.kakao.com/v2/local/search/address.json", {
                        headers: {
                            Authorization: "KakaoAK ".concat(process.env.KAKAOREST_API),
                        },
                        params: {
                            query: address,
                        },
                    })
                        .then(function (res) {
                        return res.data.documents[0];
                    })];
            case 1:
                coordinates = _a.sent();
                if (!(coordinates === undefined)) return [3 /*break*/, 2];
                res.status(400).json({ message: 'Bad Request' });
                return [3 /*break*/, 12];
            case 2:
                entityManager = (0, typeorm_1.getManager)();
                distance = 2;
                return [4 /*yield*/, entityManager
                        .query("\n    SELECT id, (\n      6371 * acos (\n      cos ( radians(".concat(Number(coordinates.y), ") )\n      * cos( radians( latitude ) )\n      * cos( radians( longitude ) - radians(").concat(Number(coordinates.x), ") )\n      + sin ( radians(").concat(Number(coordinates.y), ") )\n      * sin( radians( latitude ) )\n      )\n    ) AS distance\n    FROM posts\n    HAVING distance < ").concat(distance, "\n    ORDER BY distance"))
                        .then(function (res) {
                        return JSON.stringify(res);
                    })];
            case 3:
                nearbyProduct = _a.sent();
                if (!(JSON.parse(nearbyProduct).length === 0)) return [3 /*break*/, 4];
                res.status(200).json({ posts: [] });
                return [3 /*break*/, 12];
            case 4:
                nearbyProductId = JSON.parse(nearbyProduct).map(function (product) {
                    return Object.values(product)[0];
                });
                return [4 /*yield*/, (0, typeorm_1.getRepository)(posts_1.posts)
                        .createQueryBuilder('post')
                        .loadRelationCountAndMap('post.likes_count', 'post.likes')
                        .where('post.id IN (:...ids)', { ids: nearbyProductId })
                        .getMany()];
            case 5:
                post = _a.sent();
                if (!req.cookies.jwt) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, AuthorizeToken_1.authorizeToken)(req, res)];
            case 6:
                decoded = _a.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(users_1.default)];
            case 7:
                userRepository = _a.sent();
                return [4 /*yield*/, userRepository
                        .createQueryBuilder()
                        .select('id')
                        .where('users.email = :email', { email: decoded.email })
                        .getRawOne()
                        .then(function (res) {
                        return Object.values(res)[0];
                    })];
            case 8:
                userId = _a.sent();
                return [4 /*yield*/, (0, typeorm_1.getRepository)(likes_1.likes)];
            case 9:
                likesRepository = _a.sent();
                return [4 /*yield*/, likesRepository
                        .createQueryBuilder()
                        .select('posts_id')
                        .where('likes.users_id = :users_id', { users_id: userId })
                        .getRawMany()];
            case 10:
                like = _a.sent();
                res.status(200).json({ posts: post, likes: like });
                return [3 /*break*/, 12];
            case 11:
                res.status(200).json({ posts: post, likes: [] });
                _a.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); });
