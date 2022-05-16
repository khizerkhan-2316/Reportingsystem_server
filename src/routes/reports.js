const express = require('express');
const { userAuth, checkRole } = require('../controllers/auth.controller');

const router = express.Router();
const {
  createReports,
  getReports,
} = require('../controllers/report.controller');

router.post('/', userAuth, async (req, res) => {
  return await createReports(res);
});

router.get('/:id', userAuth, async (req, res) => {
  const { id } = req.params;
  await getReports(id, res);
});

module.exports = router;
