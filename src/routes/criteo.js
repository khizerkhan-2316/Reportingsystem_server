const express = require('express');
const {
  insertPreviousMonthStats,
  getMontlyStats,
  getCampaign,
} = require('../controllers/criteo.controller.js');
const { userAuth, checkRole } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/stats', userAuth, checkRole('admin'), async (req, res) => {
  await insertPreviousMonthStats(res);
});

module.exports = router;
