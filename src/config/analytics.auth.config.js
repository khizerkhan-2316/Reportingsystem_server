const { google } = require('googleapis');
const path = require('path');

const analyticsAuth = async () => {
  const file = path.join(__dirname, '../', 'files', 'credentials.json');
  const auth = new google.auth.GoogleAuth({
    keyFile: file,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: 'v4', auth: client });

  return googleSheets;
};

module.exports = analyticsAuth;
