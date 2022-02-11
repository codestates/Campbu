"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var Reservation_1 = __importDefault(require("../controllers/reservation/Reservation"));
var ReservationId_1 = __importDefault(require("../controllers/reservation/ReservationId"));
router.post('', Reservation_1.default);
router.patch('/:reservationId', ReservationId_1.default.patch);
router.delete('/:reservationId', ReservationId_1.default.delete);
exports.default = router;
