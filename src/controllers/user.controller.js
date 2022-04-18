const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {
  validateUsernameForUpdate,
  validateEmailForUpdate,
} = require('../helpers/validate.js');

const getAllUsers = async (res, role, serializeUser) => {
  return res
    .status(200)
    .json(
      (await User.find({ role: role, dealerId: { $exists: true } })).map(
        (user) => serializeUser(user)
      )
    );
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, username, email, state } = req.body;
    const user = await User.find({ dealerId: id });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found', success: false });
    }

    const notUsernameTaken = await validateUsernameForUpdate(username, id);

    if (!notUsernameTaken) {
      return res
        .status(409)
        .json({ message: 'Username already in use', success: false });
    }

    const notEmailTaken = await validateEmailForUpdate(email, id);

    if (!notEmailTaken) {
      return res
        .status(409)
        .json({ message: 'Email already in use', success: false });
    }

    await User.updateOne(
      { dealerId: id },
      {
        $set: {
          name,
          username,
          email,
          state,
        },
      }
    );
    return res
      .status(204)
      .json({ message: 'Updated Succesfully', success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e, success: false });
  }
};

module.exports = { getAllUsers, updateUser };
