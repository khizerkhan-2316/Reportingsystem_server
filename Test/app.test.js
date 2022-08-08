const { startApp } = require('../src/startApp');
const { app, DB, PORT } = require('./app');

describe('startApp', () => {
  it('should start the app and connect to DB', async () => {
    const result = await startApp(app, DB, 6725);
    expect(result).toBe('success');
  });
});
