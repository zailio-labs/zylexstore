const crypto = require('crypto');

class Helpers {
  // Generate random token
  static generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Sanitize user object (remove sensitive fields)
  static sanitizeUser(user) {
    if (!user) return null;
    
    const sanitized = user.toObject ? user.toObject() : { ...user };
    
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.__v;
    delete sanitized.passwordResetToken;
    delete sanitized.passwordResetExpires;
    
    return sanitized;
  }

  // Format date
  static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '';
    
    const d = new Date(date);
    const pad = (num) => num.toString().padStart(2, '0');
    
    return format
      .replace('YYYY', d.getFullYear())
      .replace('MM', pad(d.getMonth() + 1))
      .replace('DD', pad(d.getDate()))
      .replace('HH', pad(d.getHours()))
      .replace('mm', pad(d.getMinutes()))
      .replace('ss', pad(d.getSeconds()));
  }

  // Calculate OTP expiry time
  static getOTPExpiryTime(minutes = 10) {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  // Check if email is valid
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Generate JWT payload
  static generateJWTPayload(user) {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified
    };
  }

  // Delay function
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Truncate string
  static truncate(str, length = 100) {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  }
}

module.exports = Helpers;
