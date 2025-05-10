// Middleware para verificar permisos de creación de libros
exports.checkCreateBookPermission = (req, res, next) => {
    if (!req.user.permissions.createBooks) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para crear libros'
      });
    }
    next();
  };
  
  // Middleware para verificar permisos de actualización de libros
  exports.checkUpdateBookPermission = (req, res, next) => {
    if (!req.user.permissions.updateBooks) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para actualizar libros'
      });
    }
    next();
  };
  
  // Middleware para verificar permisos de eliminación de libros
  exports.checkDeleteBookPermission = (req, res, next) => {
    if (!req.user.permissions.deleteBooks) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para eliminar libros'
      });
    }
    next();
  };
  
  // Middleware para verificar permisos de actualización de usuarios
  exports.checkUpdateUserPermission = (req, res, next) => {
    // Permite que un usuario se actualice a sí mismo
    if (req.params.userId && req.params.userId === req.user.id.toString()) {
      return next();
    }
    
    // Si no es el mismo usuario, verificar si tiene permiso para actualizar otros usuarios
    if (!req.user.permissions.updateUsers) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para actualizar otros usuarios'
      });
    }
    next();
  };
  
  // Middleware para verificar permisos de eliminación de usuarios
  exports.checkDeleteUserPermission = (req, res, next) => {
    // Permite que un usuario se elimine a sí mismo
    if (req.params.userId && req.params.userId === req.user.id.toString()) {
      return next();
    }
    
    // Si no es el mismo usuario, verificar si tiene permiso para eliminar otros usuarios
    if (!req.user.permissions.deleteUsers) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para eliminar otros usuarios'
      });
    }
    next();
  };