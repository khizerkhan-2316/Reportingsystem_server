const User = require('../models/User');
const Dealer = require('../models/Dealer');
const MonthlyStatsCriteo = require('../models/MonthlyStatsCriteo');
const { getMonthlyStatsFromDB } = require('./criteo.controller');
const { validateUsername, validateEmail } = require('../helpers/validate.js');
const bcrypt = require('bcryptjs');
const {
  validateUsernameForUpdate,
  validateEmailForUpdate,
} = require('../helpers/validate.js');
const { use } = require('passport');

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

const updateAllUsers = async (res, role) => {
  try {
    const dealers = await Dealer.find({});
    const users = await User.find({ role: role });
    const stats = await getMonthlyStatsFromDB();

    console.log(stats);

    await insertUsers(dealers, users, stats);

    res.status(200).json({ success: true, message: 'Updated users' });
  } catch (e) {
    res.status(200).json({ success: false, message: 'Unable to update users' });
  }
};

const insertUsers = async (dealers, users, stats) => {
  stats.data.forEach(async (data) => {
    const dealerId = Number(data[1]);
    const isRegistered = checkIfUserIsRegistered(users, dealerId);
    if (!isRegistered) {
      const dealer = dealers.find((dealer) => dealer.dealerId === dealerId);

      if (dealer) {
        const { dealerId, name } = dealer;
        const userDetails = getUserDetails(dealerId, name);
        try {
          await registerUser(userDetails, 'user');
        } catch (e) {
          throw Error(e);
        }
      }
    }
  });
};

const registerUser = async (userDets, role) => {
  try {
    const { email, username, password } = userDets;

    const usernameNotTaken = await validateUsername(username);

    if (!usernameNotTaken) {
      throw Error('Username already taken');
    }

    const emailNotRegistered = await validateEmail(email);

    if (!emailNotRegistered) {
      throw Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      ...userDets,
      password: hashedPassword,
      role,
    });

    console.log(newUser);
    await newUser.save();
  } catch (err) {
    throw Error(err);
  }
};

const checkIfUserIsRegistered = (users, dealerId) => {
  let boolean = false;
  users.forEach((user) => {
    if (user.dealerId === dealerId) {
      boolean = true;
    }
  });

  return boolean;
};

const getUserDetails = (dealerId, name) => {
  return {
    dealerId,
    name,
    email: `${name}@test.dk`.split(' ').join(''),
    password: `${name}@test.dk`.split(' ').join(''),
    username: `${name}@test.dk`.split(' ').join(''),
    state: 'active',
  };
};

module.exports = { getAllUsers, updateUser, updateAllUsers };
