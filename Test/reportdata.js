const moment = require('moment');

const reportdata = [
  {
    dealerId: 2349124,
    month: moment().subtract(1, 'month').format('YYYY-MM'),
    ctr: 0.01,
    impressions: 100,
    clicks: 10,
    cost: 10,
    mail: 10,
    phone: 10,
    otherAds: 10,
    shared: 10,
    clickHomepage: 10,
    favorite: 10,
    monthlyConversions: 10,
    pricePerConversion: 10,
  },

  {
    dealerId: 2349124,
    month: moment().subtract(2, 'month').format('YYYY-MM'),
    ctr: 0.01,
    impressions: 100,
    clicks: 10,
    cost: 10,
    mail: 10,
    phone: 10,
    otherAds: 10,
    shared: 10,
    clickHomepage: 10,
    favorite: 10,
    monthlyConversions: 10,
    pricePerConversion: 10,
  },

  {
    dealerId: 2349124,
    month: moment().subtract(3, 'month').format('YYYY-MM'),
    ctr: 0.01,
    impressions: 100,
    clicks: 10,
    cost: 10,
    mail: 10,
    phone: 10,
    otherAds: 10,
    shared: 10,
    clickHomepage: 10,
    favorite: 10,
    monthlyConversions: 10,
    pricePerConversion: 10,
  },
];

module.exports = { reportdata };
