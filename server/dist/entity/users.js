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
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var likes_1 = require("./likes");
var posts_1 = require("./posts");
var reservation_1 = require("./reservation");
var users_reviews_1 = require("./users_reviews");
var chats_1 = require("./chats");
var users = /** @class */ (function () {
    function users() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], users.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], users.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], users.prototype, "nickname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ select: false, nullable: true }),
        __metadata("design:type", String)
    ], users.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], users.prototype, "users_img", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: 'timestamp',
            default: function () { return 'CURRENT_TIMESTAMP(6)'; },
        }),
        __metadata("design:type", Date)
    ], users.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'timestamp',
            default: function () { return 'CURRENT_TIMESTAMP(6)'; },
            onUpdate: 'CURRENT_TIMESTAMP(6)',
        }),
        __metadata("design:type", Date)
    ], users.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return likes_1.likes; }, function (likes) { return likes.users_id; }),
        __metadata("design:type", Array)
    ], users.prototype, "likes", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return users_reviews_1.users_reviews; }, function (users_reviews) { return users_reviews.users_id; }),
        __metadata("design:type", Array)
    ], users.prototype, "users_reviews", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return posts_1.posts; }, function (posts) { return posts.users_id; }),
        __metadata("design:type", Array)
    ], users.prototype, "posts", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return reservation_1.reservation; }, function (reservation) { return reservation.users_id; }),
        __metadata("design:type", Array)
    ], users.prototype, "reservation", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return chats_1.chats; }, function (chats) { return chats.users_id; }),
        __metadata("design:type", Array)
    ], users.prototype, "chats", void 0);
    users = __decorate([
        (0, typeorm_1.Entity)()
    ], users);
    return users;
}());
exports.default = users;
