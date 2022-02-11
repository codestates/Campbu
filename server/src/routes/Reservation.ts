import express from 'express';
const router = express.Router();
import reservation from '../controllers/reservation/Reservation';
import reservationId from '../controllers/reservation/ReservationId';

router.post('', reservation);
router.patch('/:reservationId', reservationId.patch);
router.delete('/:reservationId', reservationId.delete);

export default router;
