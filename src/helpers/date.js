const moment = require('moment');

const getFirstDayOfMonth = () => {
  const date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  return moment(firstDay).format('YYYY-MM-DD');
};

const getLastDayOfMonth = () => {
  const date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return moment(lastDay).format('YYYY-MM-DD');
};

const getFirstDayOfPreviousMonth = () => {
  const date = new Date();

  const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);

  return moment(firstDay).format('YYYY-MM-DD');
};

const getLastDayOfPreviousMonth = () => {
  const date = new Date();

  const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

  return moment(lastDay).format('YYYY-MM-DD');
};

module.exports = {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getFirstDayOfPreviousMonth,
  getLastDayOfPreviousMonth,
};
