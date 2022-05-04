const axios = require('axios');
const { body, criteoConfig } = require('../config/criteo.auth.config.js');
const {
  getFirstDayOfPreviousMonth,
  getLastDayOfPreviousMonth,
} = require('../helpers/date.js');
const MonthlyStatsCriteo = require('../models/MonthlyStatsCriteo.js');

const criteoToken = async () => {
  try {
    const { data } = await axios.post(
      'https://api.criteo.com/oauth2/token',
      body,
      criteoConfig
    );

    return data;
  } catch (e) {
    return e;
  }
};

const insertPreviousMonthStats = async (res) => {
  try {
    const dataFromDb = await getPreviousMonthlyStatsFromDB();
    const data = await getPreviousMonthsData();
    if (dataFromDb) {
      await MonthlyStatsCriteo.updateOne(
        { month: getFirstDayOfPreviousMonth() },
        {
          $set: {
            columns: data.columns,
            data: data.data,
          },
        }
      );

      return res.status(200).json({ message: 'Updated Stats', success: true });
    }

    await MonthlyStatsCriteo.insertMany({
      columns: data.columns,
      data: data.data,
      month: getFirstDayOfPreviousMonth(),
    });

    return res
      .status(200)
      .json({ message: 'Inserted stats in DB', success: true, data });
  } catch (e) {
    return res.status(400).json({ message: e, success: false });
  }
};

const getPreviousMonthsData = async () => {
  const { access_token } = await criteoToken();

  const { data } = await axios.get(
    `https://api.criteo.com/legacy/offsite-ads/stats/sellers?IntervalSize=Month&startDate=${getFirstDayOfPreviousMonth()}&endDate=${getLastDayOfPreviousMonth()}&advertiserId=44478`,

    { headers: { authorization: `Bearer ${access_token}` } }
  );

  return data;
};

const getPreviousMonthlyStatsFromDB = async () => {
  const data = await MonthlyStatsCriteo.findOne({
    month: {
      $gte: getFirstDayOfPreviousMonth(),
      $lte: getLastDayOfPreviousMonth(),
    },
  });

  return data;
};

module.exports = {
  criteoToken,
  insertPreviousMonthStats,
  getPreviousMonthlyStatsFromDB,
};
