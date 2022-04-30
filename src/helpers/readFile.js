var XLSX = require('xlsx');

const readFileAndGetData = async (path) => {
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return xlData;
};

module.exports = readFileAndGetData;
