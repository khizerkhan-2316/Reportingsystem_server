const { DB } = require('../LocalConfig.js');
const Country = require('../models/Country');
const getCountryData = async () => {
  return await Country.find({});
};

const getSpeceficData = async (id) => {
  console.log(id);
  return await Country.findOne({ dealerId: id });
};
module.exports = { getCountryData, getSpeceficData };
