const { sendMail } = require('./Mail.js');

const registrationMail = async (mail, role, url) => {
  const sender = '"Khizer Khan" <khizer759@gmail.com>';
  const subject = `You have created a new ${role}-account for Bilbasen Ads`;
  const text = `Congratulations!\nYou have now created your new account for Bilbasen Ads.\n\nIf you want to log in follow this link below:\n${url}.\n\nKind Regards,\nBilbasen Team`;

  await sendMail(sender, mail, subject, text);
};

module.exports = { registrationMail };
registrationMail;
