const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

// @desc    Crear una nueva reserva
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    // Asignar el usuario actual a la reserva
    req.body.user = req.user.id;
    
    // Verificar si el libro existe y está disponible
    const book = await Book.findById(req.body.book);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }
    
    // Verificar si el libro está activo
    if (!book.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Este libro no está disponible para reserva'
      });
    }
    
    // Verificar si hay copias disponibles
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay copias disponibles de este libro'
      });
    }
    
    // Verificar si el usuario ya tiene una reserva activa para este libro
    const existingReservation = await Reservation.findOne({
      user: req.user.id,
      book: req.body.book,
      status: 'activa'
    });
    
    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una reserva activa para este libro'
      });
    }
    
    // Crear la reserva
    const reservation = await Reservation.create(req.body);
    
    // Actualizar las copias disponibles del libro
    book.availableCopies -= 1;
    await book.save();
    
    // Devolver la reserva creada con información del libro y usuario
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('book', 'title author')
      .populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener todas las reservas del usuario actual
// @route   GET /api/reservations
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('book', 'title author')
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener todas las reservas de un libro
// @route   GET /api/reservations/book/:bookId
// @access  Private (solo admin)
exports.getBookReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ book: req.params.bookId })
      .populate('book', 'title author')
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Finalizar una reserva (devolver libro)
// @route   PUT /api/reservations/:reservationId
// @access  Private
exports.returnBook = async (req, res) => {
  try {
    // Buscar la reserva
    let reservation = await Reservation.findById(req.params.reservationId);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }
    
    // Verificar que la reserva pertenece al usuario actual o es un admin
    if (reservation.user.toString() !== req.user.id && !req.user.permissions.updateBooks) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta reserva'
      });
    }
    
    // Verificar que la reserva está activa
    if (reservation.status !== 'activa') {
      return res.status(400).json({
        success: false,
        message: 'Esta reserva ya no está activa'
      });
    }
    
    // Actualizar estado de la reserva
    reservation.status = 'devuelta';
    await reservation.save();
    
    // Incrementar copias disponibles del libro
    const book = await Book.findById(reservation.book);
    book.availableCopies += 1;
    await book.save();
    
    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};