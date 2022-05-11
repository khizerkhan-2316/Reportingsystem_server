const cors = require('cors');
const express = require('express');
const { success, error } = require('consola');
const { connect } = require('mongoose');
const passport = require('passport');
// const morgan = require('morgan');

require('dotenv').config();

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
// app.use(morgan('tiny'));

require('./middlewares/passport.js')(passport);

app.use('/api/users', require('./routes/users.js'));
app.use('/api/criteo', require('./routes/criteo.js'));
app.use('/api/analytics', require('./routes/analytics.js'));
app.use('/api/dealers', require('./routes/dealers.js'));

app.get('/', (req, res) => {
  res.status(200).json({ sucess: true, message: 'Production' });
});

const startApp = async () => {
  try {
    await connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    success({
      message: `Succesfully connected to the Database:`,
      badge: true,
    });

    app.listen(PORT, () =>
      success({ message: `Server listening on PORT ${PORT}...`, badge: true })
    );
  } catch (err) {
    error({
      message: `Couldn't connect to the Database:\n ${err} `,
      badge: true,
    });
  }
};

startApp();
