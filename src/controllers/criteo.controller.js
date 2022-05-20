const axios = require('axios');
const { body, criteoConfig } = require('../config/criteo.auth.config.js');
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

const getSpeceficMonthsData = async (startdate, enddate) => {
  const { access_token } = await criteoToken();

  const { data } = await axios.get(
    `https://api.criteo.com/legacy/offsite-ads/stats/sellers?IntervalSize=Month&startDate=${startdate}&endDate=${enddate}&advertiserId=44478`,

    { headers: { authorization: `Bearer ${access_token}` } }
  );
  const filteredDealers = data.data.filter(
    (dealer) => !filterOutDealersWithNoStats(dealer)
  );
  return {
    columns: data.columns,
    data: filteredDealers,
    month: startdate,
  };
};

const insertSpeceficMonthStats = async (startdate, enddate, res) => {
  try {
    const dataFromDb = await getSpeceficStatsFromDB(startdate, enddate);
    const data = await getSpeceficMonthsData(startdate, enddate);

    if (dataFromDb) {
      await MonthlyStatsCriteo.updateOne(
        { month: startdate },
        {
          $set: {
            columns: data.columns,
            data: data.data,
          },
        }
      );

      return res
        .status(200)
        .json({ message: 'Updated Stats', success: true, heading: 'Updated!' });
    }

    await MonthlyStatsCriteo.insertMany(data);

    return res.status(200).json({
      message: 'Inserted stats in DB',
      success: true,
      heading: 'Inserted!',
    });
  } catch (e) {
    return res.status(400).json({ message: e, success: false });
  }
};

const filterOutDealersWithNoStats = (row) => {
  return row[4] === 0;
};

const getSpeceficStatsFromDB = async (startdate, enddate) => {
  const data = await MonthlyStatsCriteo.findOne({
    month: {
      $gte: startdate,
      $lte: enddate,
    },
  });

  return data;
};

module.exports = {
  criteoToken,
  insertSpeceficMonthStats,
  getSpeceficStatsFromDB,
};
