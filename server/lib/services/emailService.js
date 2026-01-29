const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM } = require("../../config");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT == 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  }

  async sendOTPEmail(email, otp, type = 'signup') {
    try {
      let subject, html;
      
      switch(type) {
        case 'signup':
          subject = 'Verify Your Email - ZylexStore';
          html = this.getSignupOTPEmailTemplate(otp);
          break;
        case 'login':
          subject = 'Your Login OTP - ZylexStore';
          html = this.getLoginOTPEmailTemplate(otp);
          break;
        case 'password-reset':
          subject = 'Password Reset OTP - ZylexStore';
          html = this.getPasswordResetEmailTemplate(otp);
          break;
        default:
          subject = 'Your OTP - ZylexStore';
          html = this.getGenericOTPEmailTemplate(otp);
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'ZylexStore <noreply@zylexstore.com>',
        to: email,
        subject: subject,
        html: html,
        text: `Your OTP is: ${otp}. This OTP will expire in 10 minutes.`
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`OTP email sent to ${email}: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send OTP email to ${email}:`, error);
      throw new Error('Failed to send OTP email');
    }
  }

  getSignupOTPEmailTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; border: 2px dashed #667eea; font-size: 32px; letter-spacing: 10px; font-weight: bold; color: #333; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ZylexStore! 🎉</h1>
            <p>Your Ultimate Shopping Destination</p>
          </div>
          <div class="content">
            <h2>Email Verification Required</h2>
            <p>Thank you for signing up with ZylexStore! To complete your registration and start shopping, please verify your email address using the OTP below:</p>
            
            <div class="otp-box">${otp}</div>
            
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
            <p>If you didn't create an account with ZylexStore, please ignore this email.</p>
            
            <p>Happy Shopping!<br>The ZylexStore Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ZylexStore. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getLoginOTPEmailTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; border: 2px dashed #4CAF50; font-size: 32px; letter-spacing: 10px; font-weight: bold; color: #333; }
          .security-note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Secure Login OTP 🔒</h1>
          </div>
          <div class="content">
            <h2>Your Login Verification Code</h2>
            <p>We've received a login request for your ZylexStore account. Use the OTP below to complete your login:</p>
            
            <div class="otp-box">${otp}</div>
            
            <div class="security-note">
              <strong>⚠️ Security Alert:</strong>
              <ul>
                <li>This OTP is valid for 10 minutes only</li>
                <li>Never share this OTP with anyone</li>
                <li>ZylexStore will never ask for your password or OTP via email or phone</li>
              </ul>
            </div>
            
            <p>If you didn't attempt to log in, please secure your account immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetEmailTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; border: 2px dashed #ff6b6b; font-size: 32px; letter-spacing: 10px; font-weight: bold; color: #333; }
          .warning { color: #d63031; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your ZylexStore account. Use the OTP below to proceed:</p>
            
            <div class="otp-box">${otp}</div>
            
            <p class="warning">⚠️ If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
            
            <p>This OTP will expire in 10 minutes. After that, you'll need to request a new password reset.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
