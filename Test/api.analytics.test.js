const supertest = require('supertest');
const { startApp } = require('../src/startApp');
const { app, DB, PORT } = require('./app');
const MonthlyStatsAnalytics = require('../src/models/MonthlyStatsAnalytics');
const User = require('../src/models/User');
const moment = require('moment');
jest.setTimeout(150000);

const testAdmin = {
  email: 'test@test.dk',
  password: 'test',
  username: 'test',
  name: 'Anders Mikkelsen',
  role: 'admin',
};

const testUser = {
  email: 'test@user.dk',
  password: 'test',
  username: 'testuser',
  name: 'test-dealer',
  role: 'user',
  dealerId: 2349124,
};

beforeAll(async () => {
  await startApp(app, DB, 10000);

  await supertest(app).post('/api/users/register-admin').send(testAdmin);

  await supertest(app).post('/api/users/register-user').send(testUser);

  const response = await supertest(app)
    .post('/api/users/login-admin')
    .send(testAdmin);

  testAdmin.token = response.body.token;

  const response2 = await supertest(app)
    .post('/api/users/login-user')
    .send(testUser);

  testUser.token = response2.body.token;
});

afterAll(async () => {
  await User.deleteOne({ email: testAdmin.email });
  await User.deleteOne({ dealerId: testUser.dealerId });
});

describe('Endpoint POST: /api/analytics/stats', () => {
  it('should insert or update the last month data for analytics', async () => {
    const response = await supertest(app)
      .post('/api/analytics/stats')
      .set('Authorization', `${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const previousMonthData = await MonthlyStatsAnalytics.find({
      month: moment().subtract(1, 'month').startOf('month').format('YYYY-MM'),
    });
    expect(previousMonthData.length).toBe(1);
    expect(previousMonthData[0].month).toStrictEqual(
      new Date(moment().subtract(1, 'month').format('YYYY-MM'))
    );
  });
});
