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
  updateAllUsers,
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
  await userLogin(req.body, 'user', res);
});

router.post('/login-admin', async (req, res) => {
  await userLogin(req.body, 'admin', res);
});

router.get('/profile', userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

router.get('/admin', userAuth, checkRole('admin'), async (req, res) => {
  return res.json(serializeUser(req.user));
});

router.put('/:id', userAuth, checkRole('admin'), async (req, res) => {
  await updateUser(req, res);
});

router.get('/', userAuth, checkRole('admin'), async (req, res) => {
  await getAllUsers(res, 'user', serializeUser);
});

router.post('/', userAuth, checkRole('admin'), async (req, res) => {
  await updateAllUsers(res, 'user');
});

module.exports = router;
