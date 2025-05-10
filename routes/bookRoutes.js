const express = require('express');
const { 
  createBook, 
  getBooks, 
  getBookById, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { 
  checkCreateBookPermission, 
  checkUpdateBookPermission, 
  checkDeleteBookPermission 
} = require('../middleware/permissionMiddleware');

const router = express.Router();

// Rutas públicas
router.get('/', getBooks);
router.get('/:bookId', getBookById);

// Rutas protegidas
router.post('/', protect, checkCreateBookPermission, createBook);
router.put('/:bookId', protect, checkUpdateBookPermission, updateBook);
router.delete('/:bookId', protect, checkDeleteBookPermission, deleteBook);

module.exports = router;