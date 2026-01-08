const express = require('express');
const router = express.Router()
const fs = require('fs');
const path= require('path');

router.get('/logo', async (req, res, next) => {
	//console.log(fs.readdir(__dirname))//;, a=> console.log(a));
	res.end(fs.readFileSync(path.join(__dirname, 'logo.jpeg')));
});
router.get('/safari-pinned-tab.svg', async (req, res, next) => {
	//console.log(fs.readdir(__dirname))//;, a=> console.log(a));
	res.end(fs.readFileSync(path.join(__dirname, 'safari-pinned-tab.svg')));
});
router.get('/apple-touch-icon.png', async (req, res, next) => {
	//console.log(fs.readdir(__dirname))//;, a=> console.log(a));
	res.end(fs.readFileSync(path.join(__dirname, 'apple-touch-icon.png')));
});
router.get('/favicon.ico', async (req, res, next) => {
	//console.log(fs.readdir(__dirname))//;, a=> console.log(a));
	res.end(fs.readFileSync(path.join(__dirname, 'favicon.png')));
});
router.get('/logo.png', async (req, res, next) => {
	res.end(fs.readFileSync(path.join(__dirname, 'logo.png')));
});

module.exports = router;
