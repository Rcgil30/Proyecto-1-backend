const User = require('../models/User');

// @desc    Actualizar usuario
// @route   PUT /api/users/:userId
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { name, email, permissions } = req.body;
    const userId = req.params.userId;

    // Verificar si el usuario existe
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'El usuario está desactivado'
      });
    }

    // Actualizar datos básicos
    if (name) user.name = name;
    if (email) user.email = email;

    // Solo actualizar permisos si el usuario tiene permiso para ello
    if (permissions && req.user.permissions.updateUsers) {
      user.permissions = { ...user.permissions, ...permissions };
    }

    // Guardar cambios
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar usuario (soft delete)
// @route   DELETE /api/users/:userId
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verificar si el usuario existe
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario ya está desactivado
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya está desactivado'
      });
    }

    // Realizar soft delete
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuario desactivado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener listado de usuarios (solo administradores)
// @route   GET /api/users
// @access  Private (solo admin)
exports.getUsers = async (req, res) => {
  try {
    // Filtrar usuarios activos por defecto, a menos que se especifique lo contrario
    const showInactive = req.query.showInactive === 'true';
    const filter = showInactive ? {} : { isActive: true };

    const users = await User.find(filter).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};