const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  reservationDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    required: [true, 'Por favor ingrese una fecha de devolución']
  },
  status: {
    type: String,
    enum: ['activa', 'devuelta', 'vencida'],
    default: 'activa'
  }
});

// Índice compuesto para evitar que un usuario reserve el mismo libro más de una vez
ReservationSchema.index({ user: 1, book: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'activa' } });

module.exports = mongoose.model('Reservation', ReservationSchema);