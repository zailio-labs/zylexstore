const User = require('../db/User');
const ResponseHandler = require('../utils/responseHandler');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class UserController {
  // Get all users (admin only)
  static getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password -__v');
      
      ResponseHandler.success(res, {
        users,
        count: users.length
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      ResponseHandler.error(res, 'Failed to fetch users');
    }
  };

  // Get user by ID
  static getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password -__v');
      
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      ResponseHandler.success(res, { user });
    } catch (error) {
      logger.error('Get user by ID error:', error);
      ResponseHandler.error(res, 'Failed to fetch user');
    }
  };

  // Update user profile
  static updateProfile = async (req, res) => {
    try {
      const { name } = req.body;
      
      // Find user and update
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name },
        { new: true, runValidators: true }
      ).select('-password -__v');

      ResponseHandler.success(res, {
        user: Helpers.sanitizeUser(user)
      }, 'Profile updated successfully');
    } catch (error) {
      logger.error('Update profile error:', error);
      ResponseHandler.error(res, 'Failed to update profile');
    }
  };

  // Change password
  static changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select('+password');
      
      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return ResponseHandler.unauthorized(res, 'Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      logger.error('Change password error:', error);
      ResponseHandler.error(res, 'Failed to change password');
    }
  };

  // Delete user account
  static deleteAccount = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      // Soft delete (mark as inactive)
      user.isActive = false;
      await user.save();

      // Or hard delete
      // await User.findByIdAndDelete(req.user.id);

      logger.info(`Account deleted for user: ${user.email}`);

      ResponseHandler.success(res, null, 'Account deleted successfully');
    } catch (error) {
      logger.error('Delete account error:', error);
      ResponseHandler.error(res, 'Failed to delete account');
    }
  };
}

module.exports = UserController;
