const User = require('../models/User');

const getAllUsers = async (res, role) => {
  return res
    .status(200)
    .json(await User.find({ role: role, dealerId: { $exists: true } }));
};

module.exports = { getAllUsers };
