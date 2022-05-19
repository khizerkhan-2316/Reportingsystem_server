const mongoose = require('mongoose');
const closeApp = async (server) => {
  try {
    await mongoose.connection.close();
    await server.close();
    return 'succes';
  } catch (e) {
    return 'error';
  }
};

module.exports = { closeApp };
