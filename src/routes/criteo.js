const express = require('express');
const {
  getFirstDayOfPreviousMonth,
  getLastDayOfPreviousMonth,
} = require('../helpers/date.js');

const {
  insertSpeceficMonthStats,
} = require('../controllers/criteo.controller.js');
const {
  extractSpeceficDataFromDbData,
} = require('../controllers/criteo.dashboard.controller');

const { userAuth, checkRole } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/stats', userAuth, checkRole('admin'), async (req, res) => {
  await insertSpeceficMonthStats(
    getFirstDayOfPreviousMonth(),
    getLastDayOfPreviousMonth(),
    res
  );
});

router.get('/stats', userAuth, checkRole('admin'), async (req, res) => {
  const { startdate, enddate } = req.query;
  await insertSpeceficMonthStats(startdate, enddate, res);
});

router.get('/stats/dashboard', userAuth, async (req, res) => {
  await extractSpeceficDataFromDbData(res);
});

module.exports = router;
