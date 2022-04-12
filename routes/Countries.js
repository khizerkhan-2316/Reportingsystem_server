const express = require('express');
const { userAuth, checkRole } = require('../utils/Auth');
const router = express.Router();
const { getDataAndInsertInDB } = require('../utils/CacheData.js');
const {
  getCountryData,
  getSpeceficData,
} = require('../utils/getCachedData.js');

router.get('/', async (req, res) => {
  const data = await getCountryData();

  res.status(201).json({
    message: 'Extracted all documents from DB',
    success: true,
    data: data,
  });
});

router.post('/', async (req, res) => {
  await getDataAndInsertInDB('https://restcountries.com/v3.1/all', '', res);
});

router.get('/:dealerId', async (req, res) => {
  console.log(req.params);
  try {
    const { dealerId } = req.params;

    const data = await getSpeceficData(Number(dealerId));

    console.log(data);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
