const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTPService = require('../services/otpService');
const EmailService = require('../services/emailService');
const ResponseHandler = require('../utils/responseHandler');
const Helpers = require('../utils/helpers');
const { validators, validate } = require('../utils/validators');
const logger = require('../utils/logger');

class AuthController {
  // Generate JWT token
  static generateToken = (user) => {
    const payload = Helpers.generateJWTPayload(user);
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  };

  // Generate refresh token
  static generateRefreshToken = (user) => {
    const payload = { id: user._id };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
  };

  // User registration
  static signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return ResponseHandler.conflict(res, 'Email is already registered');
      }

      // Create new user (unverified)
      const user = await User.create({
        name,
        email,
        password,
        isVerified: false
      });

      // Generate OTP
      const otp = await OTPService.generateOTP(email, 'signup');

      // Send OTP email
      await EmailService.sendOTPEmail(email, otp, 'signup');

      logger.info(`New user registered: ${email}`);

      ResponseHandler.created(res, {
        user: Helpers.sanitizeUser(user),
        message: 'Registration successful. Please check your email for OTP verification.'
      }, 'Registration successful');
    } catch (error) {
      logger.error('Signup error:', error);
      ResponseHandler.error(res, 'Registration failed');
    }
  };

  // Send OTP for verification
  static sendOTP = async (req, res) => {
    try {
      const { email, type = 'signup' } = req.body;

      // Check if user exists for signup OTP
      if (type === 'signup') {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          return ResponseHandler.notFound(res, 'User not found. Please sign up first.');
        }
        
        if (existingUser.isVerified) {
          return ResponseHandler.conflict(res, 'User is already verified');
        }
      }

      // For login OTP, check if user exists and is verified
      if (type === 'login') {
        const user = await User.findOne({ email });
        if (!user) {
          return ResponseHandler.notFound(res, 'User not found. Please sign up first.');
        }
        
        if (!user.isVerified) {
          return ResponseHandler.unauthorized(res, 'Please verify your email first');
        }
      }

      // Generate and send OTP
      const otp = await OTPService.generateOTP(email, type);
      await EmailService.sendOTPEmail(email, otp, type);

      logger.info(`OTP sent to ${email} for ${type}`);

      ResponseHandler.success(res, null, 'OTP sent successfully');
    } catch (error) {
      logger.error('Send OTP error:', error);
      ResponseHandler.error(res, 'Failed to send OTP');
    }
  };

  // Verify OTP
  static verifyOTP = async (req, res) => {
    try {
      const { email, otp, type = 'signup' } = req.body;

      // Verify OTP
      await OTPService.verifyOTP(email, otp, type);

      if (type === 'signup') {
        // Update user verification status
        const user = await User.findOneAndUpdate(
          { email },
          { isVerified: true, lastLogin: new Date() },
          { new: true }
        );

        if (!user) {
          return ResponseHandler.notFound(res, 'User not found');
        }

        // Generate tokens
        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);

        logger.info(`User verified: ${email}`);

        ResponseHandler.success(res, {
          user: Helpers.sanitizeUser(user),
          token,
          refreshToken
        }, 'Email verified successfully');
      } else if (type === 'login') {
        // For login OTP, find user and generate tokens
        const user = await User.findOneAndUpdate(
          { email },
          { lastLogin: new Date() },
          { new: true }
        );

        if (!user) {
          return ResponseHandler.notFound(res, 'User not found');
        }

        if (!user.isVerified) {
          return ResponseHandler.unauthorized(res, 'Please verify your email first');
        }

        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);

        logger.info(`User logged in with OTP: ${email}`);

        ResponseHandler.success(res, {
          user: Helpers.sanitizeUser(user),
          token,
          refreshToken
        }, 'Login successful');
      } else {
        ResponseHandler.success(res, null, 'OTP verified successfully');
      }
    } catch (error) {
      logger.error('Verify OTP error:', error);
      ResponseHandler.error(res, error.message || 'OTP verification failed');
    }
  };

  // Login with email and password
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      // Check if user is verified
      if (!user.isVerified) {
        return ResponseHandler.unauthorized(res, 'Please verify your email first');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      logger.info(`User logged in: ${email}`);

      ResponseHandler.success(res, {
        user: Helpers.sanitizeUser(user),
        token,
        refreshToken
      }, 'Login successful');
    } catch (error) {
      logger.error('Login error:', error);
      ResponseHandler.error(res, 'Login failed');
    }
  };

  // Refresh token
  static refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return ResponseHandler.unauthorized(res, 'Refresh token is required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return ResponseHandler.unauthorized(res, 'User not found');
      }

      // Generate new tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      ResponseHandler.success(res, {
        token: newToken,
        refreshToken: newRefreshToken
      }, 'Token refreshed successfully');
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return ResponseHandler.unauthorized(res, 'Invalid refresh token');
      }
      
      if (error.name === 'TokenExpiredError') {
        return ResponseHandler.unauthorized(res, 'Refresh token expired');
      }
      
      logger.error('Refresh token error:', error);
      ResponseHandler.error(res, 'Token refresh failed');
    }
  };

  // Get current user
  static getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      ResponseHandler.success(res, {
        user: Helpers.sanitizeUser(user)
      });
    } catch (error) {
      logger.error('Get me error:', error);
      ResponseHandler.error(res, 'Failed to get user profile');
    }
  };

  // Logout (client-side only, but we can invalidate refresh tokens if needed)
  static logout = async (req, res) => {
    try {
      // In a stateless JWT system, logout is handled client-side
      // But we can implement token blacklisting if needed
      
      ResponseHandler.success(res, null, 'Logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
      ResponseHandler.error(res, 'Logout failed');
    }
  };

  // Forgot password - request OTP
  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      // Generate OTP for password reset
      const otp = await OTPService.generateOTP(email, 'password-reset');
      await EmailService.sendOTPEmail(email, otp, 'password-reset');

      logger.info(`Password reset OTP sent to ${email}`);

      ResponseHandler.success(res, null, 'Password reset OTP sent to your email');
    } catch (error) {
      logger.error('Forgot password error:', error);
      ResponseHandler.error(res, 'Failed to process password reset request');
    }
  };

  // Reset password with OTP
  static resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      // Verify OTP
      await OTPService.verifyOTP(email, otp, 'password-reset');

      // Find user and update password
      const user = await User.findOne({ email });
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      user.password = newPassword;
      user.passwordChangedAt = Date.now();
      await user.save();

      logger.info(`Password reset for user: ${email}`);

      ResponseHandler.success(res, null, 'Password reset successfully');
    } catch (error) {
      logger.error('Reset password error:', error);
      ResponseHandler.error(res, error.message || 'Password reset failed');
    }
  };
}

// Export validation middleware along with controller methods
module.exports = {
  signup: [validate(validators.signup), AuthController.signup],
  login: [validate(validators.login), AuthController.login],
  sendOTP: [validate(validators.emailOnly), AuthController.sendOTP],
  verifyOTP: [validate(validators.otpVerification), AuthController.verifyOTP],
  refreshToken: AuthController.refreshToken,
  getMe: AuthController.getMe,
  logout: AuthController.logout,
  forgotPassword: [validate(validators.emailOnly), AuthController.forgotPassword],
  resetPassword: [validate(validators.passwordReset), AuthController.resetPassword]
};
