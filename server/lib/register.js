const nodemailer = require('nodemailer');
const config = require('../config');

const mailTransporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'inrlwabots@gmail.com',
		pass: 'fpel bioh wwtc hkce'
	}
});

async function sendMail(id, makeid, code, type, host_url) {
	return new Promise(async(resolve) => {
  const registerMail = {
    from: 'inrlwabots@gmail.com',
    to: id,
    subject: 'REGISTRATION',
    html: `<html>
      <body>
          <p style="font-size:25px;">click this <a href="${host_url+'/auth/'+makeid+'/auth/'+code}">magic</a> link, you will ben redirected to our services, re ender the password and complete your registration. for multiple verification</p>
          <p align="right">thanks</p>
      </body>
  </html>`
  };
  const ResetMail = {
    from: 'inrlwabots@gmail.com',
    to: id,
    subject: 'RESET PASSWORD',
    html: `<html>
      <body>
          <p style="font-size:25px;">here is your reset password link,<a href="${host_url+'/reset/'+makeid+'/'+code}">click</a> if you want to reset your account info(password)</p>
          <p align="right">thanks</p>
      </body>
  </html>`
  }
  if(type.need =='register' && type.method == 'email') {
    return mailTransporter.sendMail(registerMail, function(err, data) {
    if (err) resolve(false);
    resolve(true);
  });
  } else if (type.need =='reset' && type.method == 'email') {
    return mailTransporter.sendMail(ResetMail, function(err, data) {
    if (err) resolve(false);
    resolve(true);
  });
  }
	});
}

module.exports = {sendMail}
