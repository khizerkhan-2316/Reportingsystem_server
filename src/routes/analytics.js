const express = require('express');
const { userAuth, checkRole } = require('../controllers/auth.controller');

const insertPreviousMonthStats = require('../controllers/analytics.controller');

const router = express.Router();

router.post('/stats', userAuth, checkRole('admin'), async (req, res) => {
  await insertPreviousMonthStats(res);
});

module.exports = router;
