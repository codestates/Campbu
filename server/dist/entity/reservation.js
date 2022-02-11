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
exports.reservation = void 0;
var typeorm_1 = require("typeorm");
var users_1 = __importDefault(require("./users"));
var posts_1 = require("./posts");
var chats_1 = require("./chats");
var reservation = /** @class */ (function () {
    function reservation() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], reservation.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)('simple-array'),
        __metadata("design:type", Array)
    ], reservation.prototype, "reservation_dates", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], reservation.prototype, "reservation_status", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], reservation.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], reservation.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return users_1.default; }, function (users) { return users.reservation; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'users_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", users_1.default)
    ], reservation.prototype, "users_id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return posts_1.posts; }, function (posts) { return posts.reservation; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'posts_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", posts_1.posts)
    ], reservation.prototype, "posts_id", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function (type) { return chats_1.chats; }, function (chats) { return chats.reservation_id; }),
        __metadata("design:type", Array)
    ], reservation.prototype, "chats", void 0);
    reservation = __decorate([
        (0, typeorm_1.Entity)()
    ], reservation);
    return reservation;
}());
exports.reservation = reservation;
