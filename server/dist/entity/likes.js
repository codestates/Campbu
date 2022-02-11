"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likes = void 0;
var typeorm_1 = require("typeorm");
var users_1 = __importDefault(require("./users"));
var posts_1 = require("./posts");
var likes = /** @class */ (function () {
    function likes() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], likes.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], likes.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], likes.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return users_1.default; }, function (users) { return users.likes; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({
            name: 'users_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", users_1.default)
    ], likes.prototype, "users_id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return posts_1.posts; }, function (posts) { return posts.likes; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({
            name: 'posts_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", posts_1.posts)
    ], likes.prototype, "posts_id", void 0);
    likes = __decorate([
        (0, typeorm_1.Entity)()
    ], likes);
    return likes;
}());
exports.likes = likes;
