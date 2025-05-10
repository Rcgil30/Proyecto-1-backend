const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor ingrese un título'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  author: {
    type: String,
    required: [true, 'Por favor ingrese un autor'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Por favor ingrese un género'],
    enum: [
      'Ficción', 'No ficción', 'Fantasía', 'Ciencia ficción', 
      'Misterio', 'Thriller', 'Romance', 'Historia', 
      'Biografía', 'Autoayuda', 'Infantil', 'Juvenil', 'Otro'
    ]
  },
  publishedDate: {
    type: Date,
    required: [true, 'Por favor ingrese una fecha de publicación']
  },
  publisher: {
    type: String,
    required: [true, 'Por favor ingrese una editorial'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Por favor ingrese un ISBN'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: [true, 'Por favor ingrese el número total de copias'],
    default: 1
  },
  availableCopies: {
    type: Number,
    required: [true, 'Por favor ingrese el número de copias disponibles'],
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Método para verificar disponibilidad
BookSchema.methods.isAvailable = function() {
  return this.isActive && this.availableCopies > 0;
};

module.exports = mongoose.model('Book', BookSchema);