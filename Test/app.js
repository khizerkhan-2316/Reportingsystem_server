const cors = require('cors');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');

require('dotenv').config();

const { DB } = require('../src/config/LocalConfig.js');
const app = express();
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', function (error) {});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(morgan('tiny'));

require('../src/middlewares/passport.js')(passport);

app.use('/api/users', require('../src/routes/users.js'));
app.use('/api/criteo', require('../src/routes/criteo.js'));
app.use('/api/analytics', require('../src/routes/analytics.js'));
app.use('/api/dealers', require('../src/routes/dealers.js'));
app.use('/api/reports', require('../src/routes/reports.js'));
app.get('/', (req, res) => {
  res.status(200).json({ sucess: true, message: 'testing' });
});

module.exports = { app, DB, PORT };
