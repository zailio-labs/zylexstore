/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

const toBool = (x) => x == 'true'
const {
	existsSync
} = require("fs")

if (existsSync('config.env')) require('dotenv').config({
	path: './config.env'
})

module.exports = {
	PORT: process.env.PORT || "8000",
	NODE_ENV: process.env.NODE_ENV || "development",
	BASE_URL: process.env.BASE_URL || "",
	FRONTEND_URL: process.env.FRONTEND_URL || "",
	MONGODB_URI: process.env.MONGODB_URI || "null",
	JWT_SECRET: process.env.JWT_SECRET || "null",
	JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "7d",
	JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "30d",
	OTP_EXPIRE_MINUTES: process.env.OTP_EXPIRE_MINUTES || "10",
	OTP_LENGTH: process.env.OTP_LENGTH || "6",
	EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
	EMAIL_PORT: process.env.EMAIL_PORT || "587",
	EMAIL_USER: process.env.EMAIL_USER || "your_email@gmail.com",
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "your_app_password",
	EMAIL_FROM: process.env.EMAIL_FROM || "ZylexStore <noreply@zylexstore.com>",
	RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || "900000",
	RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || "100",
	ANTI_CALL: process.env.ANTI_CALL || 'false'
};
