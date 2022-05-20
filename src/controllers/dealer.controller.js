const readFileAndGetData = require('../helpers/readFile.js');
const path = require('path');
const Dealer = require('../models/Dealer.js');

const updateAllDealers = async () => {
  try {
    const filePath = path.join(__dirname, '../', 'files', 'dealers.xlsx');

    const data = await readFileAndGetData(filePath);

    await insertDealers(data);
  } catch (e) {
    return e;
  }
};

const insertDealers = async (dealers) => {
  try {
    dealers.forEach(async (dealer) => {
      const dealerId = dealer['Dealer ID'];
      const name = dealer.Firmanavn;

      const newDealer = new Dealer({ dealerId, name });
      await newDealer.save();
    });
  } catch (e) {
    return e;
  }
};

module.exports = updateAllDealers;
