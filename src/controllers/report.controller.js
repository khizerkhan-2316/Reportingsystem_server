const MonthlyStatsAnalytics = require('../models/MonthlyStatsAnalytics.js');
const MonthlyStatsCriteo = require('../models/MonthlyStatsCriteo.js');
const { getFirstDayOfPreviousMonth, getLastDayOfPreviousMonth } = require('../helpers/date');


const getStatsFromDB = async () => {
    const analyticsStats = await MonthlyStatsAnalytics.find({

    });
    const criteoStats = await MonthlyStatsCriteo.find({

    });
    return { criteoStats, analyticsStats };
}


const createReports = async (res) => {
    const { criteoStats, analyticsStats } = await getStatsFromDB();

    res.status(200).json({ success: true, criteoStats, analyticsStats });
}

module.exports = createReports;