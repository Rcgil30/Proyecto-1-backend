const express = require('express');
const { 
  createReservation, 
  getMyReservations, 
  getBookReservations, 
  returnBook 
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de reservas
router.post('/', createReservation);
router.get('/', getMyReservations);
router.get('/book/:bookId', getBookReservations);
router.put('/:reservationId', returnBook);

module.exports = router;