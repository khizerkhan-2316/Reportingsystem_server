const supertest = require('supertest');
const { startApp } = require('../src/startApp');
const { app, DB, PORT } = require('./app');
const User = require('../src/models/User');

jest.setTimeout(150000);
beforeAll(async () => {
  await startApp(app, DB, 9090);
});

afterAll(async () => {
  await User.deleteOne({ email: testAdmin.email });
  await User.deleteOne({ dealerId: testUser.dealerId });
});

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

describe('Endpoint POST: /api/users/register-admin', () => {
  it('should register an admin user', async () => {
    const response = await supertest(app)
      .post('/api/users/register-admin')
      .send(testAdmin);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
    expect(response.body.success).toBe(true);
    const newUser = await User.find({ name: testAdmin.name });
    expect(newUser[0].role).toBe(testAdmin.role);
    expect(newUser[0].email).toBe(testAdmin.email);
    expect(newUser[0].name).toBe(testAdmin.name);
    expect(newUser[0].username).toBe(testAdmin.username);
    // await User.deleteOne({ email: testAdmin.email });
  });
});

describe('Endpoint POST: /api/users/register-user', () => {
  it('should register a user', async () => {
    const response = await supertest(app)
      .post('/api/users/register-user')
      .send(testUser);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
    expect(response.body.success).toBe(true);
    const newUser = await User.find({ name: testUser.name });
    expect(newUser[0].role).toBe(testUser.role);
    expect(newUser[0].email).toBe(testUser.email);
    expect(newUser[0].name).toBe(testUser.name);
    expect(newUser[0].username).toBe(testUser.username);
    expect(newUser[0].dealerId).toBe(testUser.dealerId);
    //   await User.deleteOne({ dealerId: testUser.dealerId });
  });
});

describe('Endpoint POST: /api/users/login-admin', () => {
  it('should login an admin user', async () => {
    const response = await supertest(app)
      .post('/api/users/login-admin')
      .send(testAdmin);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Succesfully logged in!');
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.body.expiresIn).toBe(168);
    testAdmin.bearerToken = response.body.token;
  });
});

// it should login an user
describe('Endpoint POST: /api/users/login-user', () => {
  it('should login an user', async () => {
    const response = await supertest(app)
      .post('/api/users/login-user')
      .send(testUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Succesfully logged in!');
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.body.expiresIn).toBe(168);
    testUser.bearerToken = response.body.token;
  });
});

//hit the route /api/users/profile and get user details and add autorization with testuser.token
describe('Endpoint GET: /api/users/profile', () => {
  it('should get the requesting users details', async () => {
    const response = await supertest(app)
      .get('/api/users/profile')
      .set('Authorization', `${testUser.bearerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.role).toBe(testUser.role);
    expect(response.body.dealerId).toBe(testUser.dealerId);
  });
});

// hit the route /api/users/admin ang get admin details and add autorization with testadmin.token
describe('Endpoint GET: /api/users/admin', () => {
  it('should get the requesting admins details', async () => {
    const response = await supertest(app)
      .get('/api/users/admin')
      .set('Authorization', `${testAdmin.bearerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testAdmin.name);
    expect(response.body.email).toBe(testAdmin.email);
    expect(response.body.username).toBe(testAdmin.username);
    expect(response.body.role).toBe(testAdmin.role);
  });
});

// hit the route /api/users/:id with testuser.dealerid as :id and set admin authorization testadmin.token and it should be a update/put method to update a user
describe('Endpoint PUT: /api/users/:id', () => {
  it('should update a user', async () => {
    const response = await supertest(app)
      .put(`/api/users/${testUser.dealerId}`)
      .set('Authorization', `${testAdmin.bearerToken}`)
      .send({
        name: 'test-dealer-updated',
        email: `${testUser.email}`,
        username: `${testUser.username}`,
        state: 'active',
        dealerId: `${testUser.dealerId}`,
        password: 'test',
      });

    expect(response.status).toBe(204);

    const updatedUser = await User.find({ dealerId: testUser.dealerId });
    testUser.name = updatedUser[0].name;
    testUser.state = updatedUser[0].state;
    expect(updatedUser[0].name).toBe('test-dealer-updated');

    // await User.deleteOne({ name: 'test-dealer-updated' });
  });
});

describe('Endpoint GET: /api/users', () => {
  it('Admin should get all users from the DB that is a cardealer', async () => {
    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', `${testAdmin.bearerToken}`);
    expect(response.status).toBe(200);

    const totalUsersInDB = await User.find({
      role: testUser.role,
      dealerId: { $exists: true },
    }).count();
    expect(response.body.length).toBe(totalUsersInDB);
  });
});

// hit the route /api/users with a post request and add a authorization with testadmin.token. It should not post anything in body
describe('Endpoint POST: /api/users', () => {
  it('Should update/create users', async () => {
    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `${testAdmin.bearerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Updated users');
    expect(response.body.success).toBe(true);
  });
});
