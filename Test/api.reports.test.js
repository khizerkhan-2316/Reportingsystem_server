const supertest = require('supertest');
const { startApp } = require('../src/startApp');
const { app, DB, PORT } = require('./app');
const User = require('../src/models/User');
const Report = require('../src/models/Report');
const { reportdata } = require('./reportdata');
const {
  getFirstDayOfMonth,
  getLastDayOfMonth,
} = require('../src/helpers/date');

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
  await startApp(app, DB, 6321);

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

  await Report.insertMany(reportdata);
});

afterAll(async () => {
  await User.deleteOne({ email: testAdmin.email });
  await User.deleteOne({ dealerId: testUser.dealerId });
});

// hit route /api/reports and add authorization header with testAdmin.token and the test should create rapports for dealers that have data in DB

describe('Endpoint POST: /api/reports', () => {
  it('should create reports for dealers that have data in DB', async () => {
    const response = await supertest(app)
      .post('/api/reports')
      .set('Authorization', `${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

// hit route /api/reports/2349124 and add authorization header with testUser.token and the test should get reports for the dealer
describe('Endpoint GET: /api/reports/:2349124', () => {
  it('should get reports for the dealer', async () => {
    const response = await supertest(app)
      .get('/api/reports/2349124')
      .set('Authorization', `${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0].ctr).toBe(reportdata[0].ctr);
    await Report.deleteMany({ dealerId: testUser.dealerId });
  });
});

// hite the route /api/reports/month with a get request and add a authorization header with testAdmin.token
// the test should get this months created reports
describe('Endpoint GET: /api/reports/month', () => {
  it('should get this months created reports', async () => {
    const response = await supertest(app)
      .get('/api/reports/month')
      .set('Authorization', `${testAdmin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
