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
exports.posts = void 0;
var typeorm_1 = require("typeorm");
var likes_1 = require("./likes");
var reservation_1 = require("./reservation");
var users_1 = __importDefault(require("./users"));
var posts = /** @class */ (function () {
    function posts() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], posts.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], posts.prototype, "category", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], posts.prototype, "deposit", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], posts.prototype, "rental_fee", void 0);
    __decorate([
        (0, typeorm_1.Column)('simple-array'),
        __metadata("design:type", Array)
    ], posts.prototype, "unavailable_dates", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], posts.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], posts.prototype, "content", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], posts.prototype, "longitude", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], posts.prototype, "latitude", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], posts.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)('simple-array'),
        __metadata("design:type", Array)
    ], posts.prototype, "img_urls", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], posts.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], posts.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return likes_1.likes; }, function (likes) { return likes.posts_id; }),
        __metadata("design:type", Array)
    ], posts.prototype, "likes", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return reservation_1.reservation; }, function (reservation) { return reservation.posts_id; }),
        __metadata("design:type", Array)
    ], posts.prototype, "reservation", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return users_1.default; }, function (users) { return users.posts; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({
            name: 'users_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", users_1.default)
    ], posts.prototype, "users_id", void 0);
    posts = __decorate([
        (0, typeorm_1.Entity)()
    ], posts);
    return posts;
}());
exports.posts = posts;
