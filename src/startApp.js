const { connect } = require('mongoose');
const { success, error } = require('consola');

const startApp = async (app, DB, PORT) => {
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
    return 'success';
  } catch (err) {
    error({
      message: `Couldn't connect to the Database:\n ${err} `,
      badge: true,
    });

    return 'error';
  }
};

module.exports = { startApp };
