const OTP = require('../models/OTP');
const logger = require('../utils/logger');

class OTPService {
  async generateOTP(email, type = 'signup') {
    try {
      // Delete any existing OTP for this email
      await OTP.deleteMany({ email, type });
      
      // Generate new OTP
      const otp = OTP.generateOTP(parseInt(process.env.OTP_LENGTH) || 6);
      
      // Save OTP to database
      const otpRecord = await OTP.create({
        email,
        otp,
        type
      });
      
      logger.info(`Generated ${type} OTP for ${email}: ${otp} (expires: ${otpRecord.expiresAt})`);
      
      return otp;
    } catch (error) {
      logger.error(`Error generating OTP for ${email}:`, error);
      throw new Error('Failed to generate OTP');
    }
  }

  async verifyOTP(email, inputOtp, type = 'signup') {
    try {
      // Find the most recent OTP for this email and type
      const otpRecord = await OTP.findOne({
        email,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      }).sort({ createdAt: -1 });
      
      if (!otpRecord) {
        throw new Error('OTP not found or expired');
      }
      
      // Verify the OTP
      const isValid = otpRecord.verify(inputOtp);
      await otpRecord.save();
      
      if (!isValid) {
        throw new Error('Invalid OTP');
      }
      
      logger.info(`OTP verified successfully for ${email} (type: ${type})`);
      return true;
    } catch (error) {
      logger.error(`OTP verification failed for ${email}:`, error.message);
      throw error;
    }
  }

  async isValidOTP(email, type = 'signup') {
    try {
      const otpRecord = await OTP.findOne({
        email,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });
      
      return !!otpRecord;
    } catch (error) {
      logger.error(`Error checking OTP validity for ${email}:`, error);
      return false;
    }
  }

  async getOTPDetails(email, type = 'signup') {
    try {
      return await OTP.findOne({
        email,
        type
      }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error(`Error getting OTP details for ${email}:`, error);
      return null;
    }
  }

  async cleanupExpiredOTPs() {
    try {
      const result = await OTP.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      logger.info(`Cleaned up ${result.deletedCount} expired OTPs`);
      return result.deletedCount;
    } catch (error) {
      logger.error('Error cleaning up expired OTPs:', error);
      return 0;
    }
  }
}

module.exports = new OTPService();
