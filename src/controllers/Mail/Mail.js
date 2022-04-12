const nodemailer = require('nodemailer');
const { transporter } = require('../../config/mail.js');
const sendMail = async (sender, mail, subject, text) => {
  let info = await transporter.sendMail({
    from: `${sender}`,
    to: `${mail}`,
    subject: `${subject}`,
    text: `${text}`,
  });
};

module.exports = { sendMail };
