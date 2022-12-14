const body = new URLSearchParams({
  grant_type: 'client_credentials',
  client_id: process.env.CRITEO_CLIENT_ID,
  client_secret: process.env.CRITEO_SECRET,
});

const criteoConfig = {
  Accept: 'text/plain',
  'Content-Type': 'application/x-www-form-urlencoded',
};

module.exports = { body, criteoConfig };
