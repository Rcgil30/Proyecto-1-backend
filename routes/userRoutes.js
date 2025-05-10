const express = require('express');
const { updateUser, deleteUser, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkUpdateUserPermission, checkDeleteUserPermission } = require('../middleware/permissionMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para administrar usuarios
router.get('/', getUsers);
router.put('/:userId', checkUpdateUserPermission, updateUser);
router.delete('/:userId', checkDeleteUserPermission, deleteUser);

module.exports = router;