const readFileAndGetData = require('../helpers/readFile.js');
const path = require('path');
const Dealer = require('../models/Dealer.js');

const updateAllDealers = async (res) => {
  const filePath = path.join(__dirname, '../', 'files', 'dealers.xlsx');

  const data = await readFileAndGetData(filePath);

  return await insertDealers(data, res);
};

const insertDealers = async (dealers, res) => {
  try {
    dealers.forEach(async (dealer) => {
      const dealerId = dealer['Dealer ID'];
      const name = dealer.Firmanavn;

      const newDealer = new Dealer({ dealerId, name });
      await newDealer.save();
    });

    res.status(201).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, error: e });
  }
};

module.exports = updateAllDealers;
