const Book = require('../models/Book');

// @desc    Crear un nuevo libro
// @route   POST /api/books
// @access  Private (solo usuarios con permiso de crear libros)
exports.createBook = async (req, res) => {
  try {
    // Añadir el usuario que crea el libro
    req.body.createdBy = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener un libro por ID
// @route   GET /api/books/:bookId
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('createdBy', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }

    // Si el libro está inactivo y no se especifica lo contrario, no mostrarlo
    if (!book.isActive && req.query.showInactive !== 'true') {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar un libro
// @route   PUT /api/books/:bookId
// @access  Private (solo usuarios con permiso de actualizar libros)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }

    // Actualizar el libro
    book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar un libro (soft delete)
// @route   DELETE /api/books/:bookId
// @access  Private (solo usuarios con permiso de eliminar libros)
exports.deleteBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }

    // Soft delete del libro
    book.isActive = false;
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Libro eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener todos los libros con filtros opcionales
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    // Extraer parámetros de filtro
    const { 
      genre, 
      author, 
      publisher, 
      title, 
      available, 
      publishedBefore, 
      publishedAfter,
      showInactive 
    } = req.query;

    // Construir el filtro
    const filter = {};

    // Filtrar por defecto solo libros activos
    if (showInactive !== 'true') {
      filter.isActive = true;
    }

    // Aplicar filtros si están presentes
    if (genre) filter.genre = genre;
    if (author) filter.author = { $regex: author, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
    if (publisher) filter.publisher = { $regex: publisher, $options: 'i' };
    if (title) filter.title = { $regex: title, $options: 'i' };
    
    // Filtrar por disponibilidad
    if (available === 'true') filter.availableCopies = { $gt: 0 };

    // Filtrar por fecha de publicación
    if (publishedBefore || publishedAfter) {
      filter.publishedDate = {};
      if (publishedBefore) filter.publishedDate.$lte = new Date(publishedBefore);
      if (publishedAfter) filter.publishedDate.$gte = new Date(publishedAfter);
    }

    // Ejecutar la consulta
    const books = await Book.find(filter).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};