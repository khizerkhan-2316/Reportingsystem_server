const supertest = require('supertest');
const { startApp } = require('../src/startApp');
const { app, DB, PORT } = require('./app');
const User = require('../src/models/User');
const MonthlyStatsCriteo = require('../src/models/MonthlyStatsCriteo');
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
  await startApp(app, DB, 9000);

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

describe('Endpoint POST: /api/criteo/stats', () => {
  it('should insert or update the last month data', async () => {
    const response = await supertest(app)
      .post('/api/criteo/stats')
      .set('Authorization', `${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const previousMonthData = await MonthlyStatsCriteo.find({
      month: moment().subtract(1, 'month').startOf('month').format('YYYY-MM'),
    });
    expect(previousMonthData.length).toBe(1);
    expect(previousMonthData[0].month).toStrictEqual(
      new Date(moment().subtract(1, 'month').format('YYYY-MM'))
    );
  });
});

describe('Endpoint GET: /api/criteo/stats', () => {
  it('should insert data for criteo between the chosen dates', async () => {
    const response = await supertest(app)
      .get('/api/criteo/stats')
      .query({
        startdate: moment()
          .subtract(15, 'month')
          .startOf('month')
          .format('YYYY-MM-DD'),
        enddate: moment()
          .subtract(15, 'month')
          .endOf('month')
          .format('YYYY-MM-DD'),
      })
      .set('Authorization', `${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const previousMonthData = await MonthlyStatsCriteo.find({
      month: moment()
        .subtract(15, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
    });
    expect(previousMonthData.length).toBe(1);
    expect(moment(previousMonthData[0].month).format('YYYY-MM--DD')).toBe(
      moment().subtract(15, 'month').startOf('month').format('YYYY-MM--DD')
    );
  });
});

describe('Endpoint GET: /api/criteo/stats/dashboard', () => {
  it('should extract the nessecery data from DB related to criteo dashboard', async () => {
    const response = await supertest(app)
      .get('/api/criteo/stats/dashboard')
      .set('Authorization', `${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.revenue > 0).toBe(true);
    expect(response.body.data.topDealers.length >= 10).toBe(true);
  });
});
