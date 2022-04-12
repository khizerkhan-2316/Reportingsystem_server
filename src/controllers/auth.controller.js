const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/index.js');
const passport = require('passport');
const { registrationMail } = require('./Mail/RegistrationMail');

const registerUser = async (userDets, role, res) => {
  const { email, username, password } = userDets;

  const usernameNotTaken = await validateUsername(username);

  if (!usernameNotTaken) {
    return res.status(400).json({
      message: 'Username already taken',
      success: false,
    });
  }

  const emailNotRegistered = await validateEmail(email);

  if (!emailNotRegistered) {
    return res.status(400).json({
      message: 'Email already registered',
      success: false,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      ...userDets,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const url =
      role === 'user'
        ? 'https://reporting-system.netlify.app/'
        : 'https://reporting-system.netlify.app/admin';

    await registrationMail(email, role, url);

    return res.status(201).json({ message: 'User created', success: true });
  } catch (err) {
    return res.status(500).json({ message: err, success: false });
  }
};

const userLogin = async (userCreds, role, res) => {
  const { username, password } = userCreds;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found', success: false });
  }

  if (user.role !== role) {
    return res
      .status(403)
      .json({ message: 'Please use the correct URL', success: false });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(403)
      .json({ message: 'Incorret password', success: false });
  } else {
    const token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      SECRET,
      { expiresIn: '7 days' }
    );

    const result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: 'Succesfully logged in!',
      success: true,
    });
  }
};

const validateUsername = async (username) => {
  const user = await User.findOne({ username });

  return user ? false : true;
};

const validateEmail = async (email) => {
  const user = await User.findOne({ email });

  return user ? false : true;
};

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json({ message: 'Unauthorized', success: false })
    : next();

const userAuth = passport.authenticate('jwt', { session: false });

const serializeUser = (user) => {
  return {
    username: user.username,
    name: user.name,
    email: user.email,
    name: user.name,
    role: user.role,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerUser,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
};
