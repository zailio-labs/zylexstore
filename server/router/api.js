const express = require('express');
const router = express.Router()
const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');
const {verifiedUsers, updateByCode, pincode: pc} = require('../lib');
const { Readable } = require('stream');
const {io} = require('../index');

router.post('/get_url', async (req, res, next) => {
  try {
  const all = await verifiedUsers();
  const buff = req.files.file;
  const req_from = req.body.token;
  if(!req_from) return res.status(403).json({
    message: 'Internal server error'
  });
  if(!buff) return res.status(403).json({
    message: 'Internal server error'
  });
  if(!all.map(a=>a.token).includes(req_from)) return res.status(403).json({
    message: 'Internal server error'
  });
  const stream = Readable.from(buff.data)
  const data = new FormData();
  data.append('image', stream);
  const headers = {
    'Authorization': `Client-ID ${config.imgur}`,
    ...data.getHeaders()
  };
  const configuration = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.imgur.com/3/upload',
    headers: headers,
    data: data
  };
  const response = await axios(configuration).catch(_=>{
  return res.status(503).json({
    message: 'server is currently unable to handle the incoming requests'
  });
})
  if(!response?.data?.data?.link) {
    if(res.headersSent) return;
    return res.status(502).json({
      message: 'Bad Gateway'
    });
  }
  console.log(`url: ${response.data.data.link}`);
  return res.json({url: response.data.data.link })
  } catch (e) {
    console.log('error: ', e);
    return res.json({
      status: false,
      message: 'error',
      result: e
    });
  }
});


router.post('/url', async (req, res, next) => {
  try {
  const all = await verifiedUsers();
  const buff = req.files.file;
  const req_from = req.body.token;
  if(!req_from) return res.status(403).json({
    message: 'Internal server error'
  });
  if(!buff) return res.status(403).json({
    message: 'Internal server error'
  });
  if(!all.map(a=>a.token).includes(req_from)) return res.status(403).json({
    message: 'Internal server error'
  });
  const stream = Readable.from(buff.data)
  const data = new FormData();
  data.append('image', stream);
  const headers = {
    'Authorization': `Client-ID ${config.imgur}`,
    ...data.getHeaders()
  };
  const configuration = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.imgur.com/3/upload',
    headers: headers,
    data: data
  };
  const response = await axios(configuration).catch(_=>{
  return res.status(503).json({
    message: 'server is currently unable to handle the incoming requests'
  });
})
  if(!response?.data?.data?.link) {
    if(res.headersSent) return;
    return res.status(502).json({
      message: 'Bad Gateway'
    });
  }
  const db = await updateByCode(req_from, {
    img: response.data.data.link
  });
  io.emit('user-info', db)
  return res.json({status: true})
    } catch (e) {
    console.log('error: ', e);
    return res.json({
      status: false,
      message: 'error',
      result: e
    });
    }
});
router.post('/grablocation', async (req, res, next) => {
  try {
  const time = new Date().getTime();
  const {pincode, auth} = req.body;
  if(!pc || !auth) return res.json({
    status: false,
    message: 'not full filled with content',
    result: 'un otheraised request error'
  });
  let resp = [];
  for(const i of pc) {
    if(pincode.toString() == i.Pincode) resp.push(i);
  }
  return res.json({ 
    status: true,
    ms: time - new Date().getTime(),
    result: resp,
    fetched_from: 'smr_by-inrl'
  });
  } catch (e) {
    console.log('error: ', e);
    return res.json({
      status: false,
      message: 'error',
      result: e
    });
  }
});

router.post('/getlocation', async (req, res, next) => {
  const {lat, lon} = req.body;
  if(!lat ||!lon) return res.json({status: false});
  try {
    const {data} = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.json({status: 'error'});
  }
});
module.exports = router;
