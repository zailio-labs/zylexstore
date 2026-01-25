const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware');
const { catchAsync } = require('../middleware/errorMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.get('/me', AuthMiddleware.protect, catchAsync(authController.getMe));
router.post('/logout', AuthMiddleware.protect, catchAsync(authController.logout));
router.put('/profile', AuthMiddleware.protect, catchAsync(userController.updateProfile));
router.put('/change-password', AuthMiddleware.protect, catchAsync(userController.changePassword));
router.delete('/account', AuthMiddleware.protect, catchAsync(userController.deleteAccount));

// Admin only routes
router.get('/users', 
  AuthMiddleware.protect, 
  AuthMiddleware.restrictTo('admin'), 
  catchAsync(userController.getAllUsers)
);

router.get('/users/:id', 
  AuthMiddleware.protect, 
  AuthMiddleware.restrictTo('admin'), 
  catchAsync(userController.getUserById)
);

module.exports = router;
