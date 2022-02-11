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
exports.users_reviews = void 0;
var typeorm_1 = require("typeorm");
var reviews_1 = require("./reviews");
var users_1 = __importDefault(require("./users"));
var users_reviews = /** @class */ (function () {
    function users_reviews() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], users_reviews.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], users_reviews.prototype, "count", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], users_reviews.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], users_reviews.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return users_1.default; }, function (users) { return users.users_reviews; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'users_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", users_1.default)
    ], users_reviews.prototype, "users_id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return reviews_1.reviews; }, function (reviews) { return reviews.users_reviews; }, {
            onDelete: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({
            name: 'reviews_id',
            referencedColumnName: 'id',
        }),
        __metadata("design:type", reviews_1.reviews)
    ], users_reviews.prototype, "reviews_id", void 0);
    users_reviews = __decorate([
        (0, typeorm_1.Entity)()
    ], users_reviews);
    return users_reviews;
}());
exports.users_reviews = users_reviews;
