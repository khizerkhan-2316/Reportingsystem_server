const express = require('express');
const router = express.Router();
const updateAllDealers = require('../controllers/dealer.controller');

router.get('/', async (req, res) => {
  try {
    await updateAllDealers();
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
});

module.exports = router;
