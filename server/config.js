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
	ANTI_CALL: process.env.ANTI_CALL || 'false'
};
