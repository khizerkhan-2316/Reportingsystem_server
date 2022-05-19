const MonthlyStatsAnalytics = require('../models/MonthlyStatsAnalytics.js');
const MonthlyStatsCriteo = require('../models/MonthlyStatsCriteo.js');
const User = require('../models/User.js');
const { getQuarter } = require('../helpers/date.js');
const getAllStatsFromDB = async () => {
  const criteoStats = await MonthlyStatsCriteo.find({}).sort({ month: 'desc' });
  const analytics = await MonthlyStatsAnalytics.find({}).sort({
    month: 'desc',
  });
  return { criteoStats, analytics };
};

const extractSpeceficDataFromDbData = async (res) => {
  const { criteoStats, analytics } = await getAllStatsFromDB();
  const revenue = await calculateTotalRevenueQ();
  const topDealers = await calculateTopTenRevenueDealersQ();
  const data = { revenue, topDealers };
  res.status(200).json({ success: true, data });
};

const calculateTotalRevenueQ = async () => {
  const quarterStats = await getQuarterStatsFromDB();
  let revenue = 0;
  quarterStats.forEach((stat) => {
    stat.data.forEach((item) => (revenue += item[5]));
  });

  return Math.floor(revenue);
};

const calculateTopTenRevenueDealersQ = async () => {
  const quarterStats = await getQuarterStatsFromDB();
  const users = await User.find({});
  // run all users through and run through quarter stats and run through data and find the top 10 highest revenue and compare with dealerId from User and return the top 10
  const topTenDealers = [];
  let sum = 0;
  users.forEach((user) => {
    const dealerId = user.dealerId;
    const dealerRevenue = [];
    quarterStats.forEach((stat) => {
      stat.data.forEach((item) => {
        if (item[1] === dealerId) {
          sum += item[5];
        }
      });

      dealerRevenue.push({ dealerId, revenue: sum });
    });

    topTenDealers.push(dealerRevenue);
    sum = 0;
  });

  // filter the multidimensional array of objects and return the top 10 revenue
  const topTenRevenueDealers = topTenDealers.map((dealer) => {
    return dealer.sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  });

  return topTenRevenueDealers;
};

const getQuarterStatsFromDB = async () => {
  const startQuarter = getQuarter().startOfQuarter;
  const endQuarter = getQuarter().endOfQuarter;
  const quarterStats = await MonthlyStatsCriteo.find({
    month: {
      $gte: new Date(startQuarter),
      $lte: new Date(endQuarter),
    },
  });

  return quarterStats;
};

module.exports = { extractSpeceficDataFromDbData };
