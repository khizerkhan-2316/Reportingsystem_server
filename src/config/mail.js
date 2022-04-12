const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.APP_MAIL,
    pass: process.env.APP_MAIL_PASSWORD,
  },
});

module.exports = { transporter };
