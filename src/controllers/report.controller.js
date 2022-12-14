const MonthlyStatsAnalytics = require('../models/MonthlyStatsAnalytics.js');
const MonthlyStatsCriteo = require('../models/MonthlyStatsCriteo.js');
const User = require('../models/User.js');
const Report = require('../models/Report.js');
const {
  formatDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} = require('../helpers/date.js');
const getStatsFromDB = async () => {
  const criteoStats = await MonthlyStatsCriteo.find({}).sort({ month: 'desc' });
  const analytics = await MonthlyStatsAnalytics.find({}).sort({
    month: 'desc',
  });
  return { criteoStats, analytics };
};

const isSameReport = (createdReports, reportsFromDb) => {
  return (
    createdReports.month === formatDate(reportsFromDb.month) &&
    createdReports.dealerId === reportsFromDb.dealerId
  );
};

const onlyInLeft = (left, right, compareFunction) =>
  left.filter(
    (leftValue) =>
      !right.some((rightValue) => compareFunction(leftValue, rightValue))
  );

const createReports = async (res) => {
  try {
    const { criteoStats, analytics } = await getStatsFromDB();
    const users = await User.find({});
    users.forEach(async (user, index) => {
      const { dealerId } = user;

      const reportFromDB = await Report.find({ dealerId });
      const reports = calculateDataForDealer(dealerId, criteoStats, analytics);
      const newReports = onlyInLeft(reports, reportFromDB, isSameReport);
      const oldReports = onlyInLeft(reports, newReports, isSameReport);

      if (reportFromDB) {
        await oldReports.forEach(async (report) => {
          await Report.updateOne(
            { month: report.month, dealerId: report.dealerId },
            {
              $set: {
                ctr: report.ctr,
                impressions: report.impressions,
                clicks: report.clicks,
                cost: report.cost,
                mail: report.mail,
                phone: report.phone,
                otherAds: report.otherAds,
                shared: report.shared,
                clickHomepage: report.clickHomepage,
                favorite: report.favorite,
                monthlyConversions: report.monthlyConversions,
                pricePerConversion: report.pricePerConversion,
              },
            }
          );
        });
      }

      if (newReports.length > 0) {
        await Report.insertMany(newReports);
      }
    });

    res.status(200).json({
      success: true,
      message: 'Created reports',
      heading: 'Created!',
    });
  } catch (e) {
    res.status(400).json({ error: e, success: false });
  }
};

const calculateDataForDealer = (dealerId, criteostats, analytics) => {
  const reports = [];
  criteostats.forEach((month) => {
    const criteoMonth = month.month;
    month.data.forEach((dealer) => {
      if (isMatch(Number(dealerId), Number(dealer[1]))) {
        let analyticsDealer = null;
        analytics.forEach((month) => {
          const analyticsMonth = month.month;
          month.data.forEach((dealer) => {
            if (
              isMatch(Number(dealerId), Number(dealer[1])) &&
              criteoMonth - analyticsMonth === 0
            ) {
              analyticsDealer = dealer;
            }
          });
        });

        reports.push(generateReport(dealer, analyticsDealer));
      }
    });
  });

  return reports;
};

const generateReport = (dealer, analyticsDealer) => {
  const ctr = calculateCTR(dealer[4], dealer[3]);
  const cost = dealer[5] * 2;

  if (analyticsDealer === null) {
    return {
      dealerId: Number(dealer[1]),
      month: dealer[2],
      ctr,
      impressions: dealer[3],
      clicks: dealer[4],
      cost,
      mail: 0,
      phone: 0,
      otherAds: 0,
      shared: 0,
      clickHomepage: 0,
      favorite: 0,
      monthlyConversions: 0,
      pricePerConversion: 0,
    };
  }

  const pricePerConversion = (dealer[5] / analyticsDealer[3]).toFixed(2);

  return {
    dealerId: Number(dealer[1]),
    month: dealer[2],
    ctr,
    impressions: dealer[3],
    clicks: dealer[4],
    cost,
    mail: Number(analyticsDealer[4]),
    phone: Number(analyticsDealer[5]),
    otherAds: Number(analyticsDealer[6]),
    shared: Number(analyticsDealer[7]),
    clickHomepage: Number(analyticsDealer[8]),
    favorite: Number(analyticsDealer[9]),
    monthlyConversions: Number(analyticsDealer[3]),
    pricePerConversion,
  };
};

const getReports = async (dealerId, res) => {
  const reports = await Report.find({ dealerId }).sort({ month: 1 });
  res.status(200).json({ success: true, data: reports });
};

const isMatch = (userDealerId, statsDealerId) => {
  return Number(userDealerId) === Number(statsDealerId);
};

const calculateCTR = (clicks, impressions) => {
  return ((clicks / impressions) * 100).toFixed(2);
};

const getMonthlyReports = async (res) => {
  try {
    const reports = await Report.find({
      createdAt: {
        $gte: getFirstDayOfMonth(),
        $lte: getLastDayOfMonth(),
      },
    });

    const uniqueDealerIds = [
      ...new Set(reports.map((report) => report.dealerId)),
    ];

    const dealers = await User.find({ dealerId: { $in: uniqueDealerIds } });
    const createdAt = reports[0].createdAt;

    const serializedDealers = dealers.map((dealer) => {
      const dealerReports = reports.filter(
        (report) => report.dealerId === dealer.dealerId
      );
      return {
        ...serializeUser(dealer),
        reports: dealerReports,
        createdAt,
      };
    });
    res.status(200).json({ success: true, data: serializedDealers });
  } catch (e) {
    res.status(500).json({ success: false, data: e });
  }
};

const serializeUser = (user) => {
  return {
    name: user.name,
    dealerId: user.dealerId,
    state: user.state,
  };
};

module.exports = { createReports, getReports, getMonthlyReports };
