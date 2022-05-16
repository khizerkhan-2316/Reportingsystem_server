const express = require('express');
const {
  getFirstDayOfPreviousMonth,
  getLastDayOfPreviousMonth,
} = require('../helpers/date.js');

const {
  insertSpeceficMonthStats,
} = require('../controllers/criteo.controller.js');
const { userAuth, checkRole } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/stats', userAuth, checkRole('admin'), async (req, res) => {
  await insertSpeceficMonthStats(
    getFirstDayOfPreviousMonth(),
    getLastDayOfPreviousMonth(),
    res
  );
});

router.get('/stats', async (req, res) => {
  const { startdate, enddate } = req.query;
  await insertSpeceficMonthStats(startdate, enddate, res);
});

module.exports = router;
