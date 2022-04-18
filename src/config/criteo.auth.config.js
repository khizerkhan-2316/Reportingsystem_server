const body = new URLSearchParams({
  grant_type: 'client_credentials',
  client_id: process.env.CRITEO_CLIENT_ID,
  client_secret: process.env.CRITEO_SECRET,
});

const { client_id, client_secret } = body;

console.log(client_id, client_secret);

const criteoConfig = {
  Accept: 'text/plain',
  'Content-Type': 'application/x-www-form-urlencoded',
};

module.exports = { body, criteoConfig };
