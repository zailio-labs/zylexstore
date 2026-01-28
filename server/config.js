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
	PORT: process.env.PORT || 8000,
	TOTAL_FORK: process.env.TOTAL_FORK || "1",
	BGM_URL: process.env.BGM_URL || "null",
	ANTI_CALL: process.env.ANTI_CALL || 'false'
};
