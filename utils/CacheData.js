const axios = require('axios');
const Country = require('../models/Country.js');
const { writeFileAsync } = require('fs');

const getDataAndInsertInDB = async (url, collection, res) => {
  const { data } = await axios.get(url);

  await Country.collection.insertMany(data);

  res.status(201).json({ message: 'inserted in DB', success: true });
};

module.exports = { getDataAndInsertInDB };
