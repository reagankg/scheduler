const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const { createAuditLog } = require('../middleware/auditLog');

router.post('/register', createAuditLog('Create User', 'CREATE', 'Auth Module'), authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/verify', authenticate, authController.verifyToken);
router.delete('/users/:id',createAuditLog('Delete User', 'DELETE', 'Auth Module'), authController.deleteUser);
router.post('/reset-password/:id', createAuditLog('Reset Password', 'RESET', 'Auth Module'), authController.resetPassword);
router.get('/user/:id', authController.getUserById);
router.get('/users', authController.getAllUsers);
router.put('/users/:id', createAuditLog('Update User', 'UPDATE', 'Auth Module'), authController.updateUser);

// Protected system_admin route example
router.get('/system_admin',
  authenticate, 
  authorize(['system_admin']),
  (req, res) => {
    res.json({ message: 'system_admin access granted' });
  }
);

module.exports = router;