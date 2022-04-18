const User = require('../models/User');

const validateUsername = async (username) => {
  const user = await User.findOne({ username });

  return user ? false : true;
};

const validateEmail = async (email) => {
  const user = await User.findOne({ email });

  return user ? false : true;
};

const validateUsernameForUpdate = async (username, dealerId) => {
  const user = await User.findOne({ username, dealerId: { $ne: dealerId } });

  return user ? false : true;
};

const validateEmailForUpdate = async (email, dealerId) => {
  const user = await User.findOne({ email, dealerId: { $ne: dealerId } });

  return user ? false : true;
};

module.exports = {
  validateUsername,
  validateEmail,
  validateUsernameForUpdate,
  validateEmailForUpdate,
};
