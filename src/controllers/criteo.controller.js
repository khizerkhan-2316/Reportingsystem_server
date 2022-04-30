const axios = require('axios');
const { body, criteoConfig } = require('../config/criteo.auth.config.js');
const { getFirstDayOfMonth, getLastDayOfMonth } = require('../helpers/date.js');
const MonthlyStatsCriteo = require('../models/MonthlyStatsCriteo.js');

const criteoToken = async (res) => {
  try {
    const { data } = await axios.post(
      'https://api.criteo.com/oauth2/token',
      body,
      criteoConfig
    );

    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ message: e, success: false });
  }
};

const stats = async (req, res) => {
  try {
    const { authorization } = req.body;
    const { data } = await axios.get(
      `https://api.criteo.com/legacy/offsite-ads/stats/sellers?IntervalSize=Month&startDate=${getFirstDayOfMonth()}&endDate=${getLastDayOfMonth}&advertiserId=44478`,

      { headers: { authorization: `Bearer ${authorization}` } }
    );

    const dataFromDb = await getMonthlyStatsFromDB();
    if (dataFromDb) {
      return res
        .status(400)
        .json({ message: 'Already got data for this month', success: false });
    }

    await MonthlyStatsCriteo.insertMany(data);

    return res
      .status(200)
      .json({ message: 'Inserted stats in DB', success: true, data });
  } catch (e) {
    return res.status(400).json({ message: e, success: false });
  }
};

const getMontlyStats = async (res) => {
  const data = await getMonthlyStatsFromDB();
  return data
    ? res.status(200).json(data)
    : res
        .status(404)
        .json({ message: 'Monthly data not found', success: false });
};

const getMonthlyStatsFromDB = async () => {
  const data = await MonthlyStatsCriteo.findOne({
    createdAt: {
      $gte: getFirstDayOfMonth(),
      $lte: getLastDayOfMonth(),
    },
  });

  return data;
};

const getCampaign = async (req, res) => {
  try {
    const { authorization } = req.body;
    const { data } = await axios.get(
      'https://api.criteo.com/2022-01/marketing-solutions/campaigns/227979',
      { headers: { authorization: `Bearer ${authorization}` } }
    );

    res.status(200).json({ message: 'Extracted campaign data', success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e, success: false });
  }
};

module.exports = {
  criteoToken,
  stats,
  getMontlyStats,
  getCampaign,
  getMonthlyStatsFromDB,
};
