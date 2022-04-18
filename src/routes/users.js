const express = require('express');
const {
  registerUser,
  userLogin,
  userAuth,

  checkRole,
} = require('../controllers/auth.controller');

const {
  getAllUsers,
  updateUser,
} = require('../controllers/user.controller.js');

const { serializeUser } = require('../helpers/serializeUser.js');

const router = express.Router();

router.post('/register-user', async (req, res) => {
  await registerUser(req.body, 'user', res);
});

router.post('/register-admin', async (req, res) => {
  await registerUser(req.body, 'admin', res);
});

router.post('/login-user', async (req, res) => {
  await userLogin(req.body, 'user', res, 'active');
});

router.post('/login-admin', async (req, res) => {
  await userLogin(req.body, 'admin', res);
});

router.get('/profile', userAuth, checkRole('user'), async (req, res) => {
  console.log(req.user);
  return res.json(serializeUser(req.user));
});

router.get('/admin', userAuth, checkRole('admin'), async (req, res) => {
  return res.json(serializeUser(req.user));
});

router.put('/:id', async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  await updateUser(req, res);
});

router.get('/', userAuth, checkRole('admin'), async (req, res) => {
  await getAllUsers(res, 'user', serializeUser);
});

router.get('/user-protected', userAuth, checkRole('user'), async (req, res) => {
  res.status(200).json({ message: 'User routhe', success: true });
});

router.get('/admin-protected', userAuth, async (req, res) => {
  console.log(req);
  res.status(200).json('Success');
});

module.exports = router;
