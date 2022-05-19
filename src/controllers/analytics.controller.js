const analyticsAuth = require('../config/analytics.auth.config');
const MonthlyStatsAnalytics = require('../models/MonthlyStatsAnalytics.js');

const {
  getFirstDayOfPreviousMonth,
  getLastDayOfPreviousMonth,
} = require('../helpers/date.js');

const insertPreviousMonthStats = async (res) => {
  try {
    const analyticsStatsFromDB = await getPreviousMonthlyStatsFromDB();
    const stats = await getPreviousMonthStatsFromAnalytics();

    if (analyticsStatsFromDB) {
      await MonthlyStatsAnalytics.updateOne(
        {
          month: getFirstDayOfPreviousMonth(),
        },
        {
          $set: {
            columns: stats.columns,
            data: stats.data,
            month: stats.month,
          },
        }
      );

      return res
        .status(200)
        .json({ message: 'Updated Stats', success: true, heading: 'Updated!' });
    }
    console.log(stats);
    await MonthlyStatsAnalytics.insertMany(stats);
    return res.status(200).json({
      message: 'Inserted stats in DB',
      success: true,
      heading: 'Inserted!',
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e, success: false });
  }
};

const getPreviousMonthStatsFromAnalytics = async () => {
  try {
    const googleSheets = await analyticsAuth();

    const spreadsheetId = '175gxL9WxncWD9xwcCOkPa2DXTBV4lRJ4CFoB5JFEf80';

    const getRows = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Criteo Forhandler/konv',
    });

    const data = await getRows.data.values
      .filter((row, index) => index >= 3 && !filterOutDealersWithNoStats(row))
      .map((row) => {
        return [...row, getFirstDayOfPreviousMonth()];
      });

    return {
      month: getFirstDayOfPreviousMonth(),
      data,
      columns: getRows.data.values[2],
    };
  } catch (e) {
    return e;
  }
};

const filterOutDealersWithNoStats = (row) => {
  let totalKonveteringer = 0;
  row.forEach((item, index) => {
    if (index >= 3) {
      totalKonveteringer += parseInt(item);
    }
  });

  return totalKonveteringer === 0 ? true : false;
};

const getPreviousMonthlyStatsFromDB = async () => {
  const data = await MonthlyStatsAnalytics.findOne({
    month: {
      $gte: getFirstDayOfPreviousMonth(),
      $lte: getLastDayOfPreviousMonth(),
    },
  });

  return data;
};

module.exports = insertPreviousMonthStats;
