const nodemailer = require('nodemailer');
const { transporter } = require('../../config/MailConfig.js');
const sendMail = async (sender, mail, subject, text) => {
  let info = await transporter.sendMail({
    from: `${sender}`,
    to: `${mail}`,
    subject: `${subject}`,
    text: `${text}`,
  });
};

module.exports = { sendMail };
