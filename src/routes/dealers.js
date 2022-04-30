const express = require('express');
const router = express.Router();
const updateAllDealers = require('../controllers/dealer.controller');

router.get('/', async (req, res) => {
  await updateAllDealers(res);
});

module.exports = router;
