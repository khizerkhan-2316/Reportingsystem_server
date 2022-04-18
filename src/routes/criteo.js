const express = require('express');
const {
  criteoToken,
  stats,
  getMontlyStats,
  getCampaign,
} = require('../controllers/criteo.controller.js');
const { userAuth, checkRole } = require('../controllers/auth.controller');
const router = express.Router();

router.get('/auth', async (req, res) => {
  await criteoToken(res);
});

router.post('/stats/monthly', async (req, res) => {
  await stats(req, res);
});

router.get('/stats/monthly', async (req, res) => {
  await getMontlyStats(res);
});

/*
router.post('/campagins/campaign', async (req, res) => {
  await getCampaign(req, res);
});
 */
module.exports = router;
