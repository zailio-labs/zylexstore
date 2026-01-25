const mongoose = require('mongoose');
const crypto = require('crypto');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  type: {
    type: String,
    enum: ['signup', 'password-reset', 'login'],
    default: 'signup'
  },
  attempts: {
    type: Number,
    default: 0,
    max: [5, 'Maximum OTP attempts exceeded']
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: function() {
      const now = new Date();
      const expireMinutes = parseInt(process.env.OTP_EXPIRE_MINUTES) || 10;
      return new Date(now.getTime() + expireMinutes * 60 * 1000);
    },
    index: { expires: '10m' } // Auto delete after 10 minutes
  }
}, {
  timestamps: true
});

// Generate OTP
OTPSchema.statics.generateOTP = function(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Verify OTP
OTPSchema.methods.verify = function(inputOtp) {
  if (this.isUsed) {
    throw new Error('OTP has already been used');
  }
  
  if (this.expiresAt < new Date()) {
    throw new Error('OTP has expired');
  }
  
  if (this.attempts >= 5) {
    throw new Error('Maximum OTP attempts exceeded');
  }
  
  this.attempts += 1;
  
  if (this.otp !== inputOtp) {
    return false;
  }
  
  this.isUsed = true;
  return true;
};

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;
