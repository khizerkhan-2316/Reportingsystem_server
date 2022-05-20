const cors = require('cors');
const express = require('express');
const passport = require('passport');
//const morgan = require('morgan');
const { startApp } = require('./startApp');

require('dotenv').config();

//Production DB:
const { DB } = require('./config/index.js');

//const { DB } = require('./config/LocalConfig.js');
const app = express();
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
//app.use(morgan('tiny'));

require('./middlewares/passport.js')(passport);

app.use('/api/users', require('./routes/users.js'));
app.use('/api/criteo', require('./routes/criteo.js'));
app.use('/api/analytics', require('./routes/analytics.js'));
app.use('/api/dealers', require('./routes/dealers.js'));
app.use('/api/reports', require('./routes/reports.js'));

app.get('/', (req, res) => {
  res.status(200).json({ sucess: true, message: 'Server is running' });
});

startApp(app, DB, PORT);
