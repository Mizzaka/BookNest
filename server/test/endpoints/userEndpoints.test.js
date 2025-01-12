jest.mock('multer-s3', () => {
    return () => ({
      single: () => (req, res, next) => next(), // Mock the middleware to do nothing
    });
  });


const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
const User = require("../../models/User");
const app = require('../../app'); // Adjust the path as necessary


describe('User Endpoints', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phoneNumber: '1234567890'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toEqual('john@example.com');
    });

    it('should not create a user with an existing email', async () => {
      await User.create({
        fullName: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        phoneNumber: '1234567890'
      });

      const res = await request(app)
        .post('/api/users')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phoneNumber: '1234567890'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('User already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should fetch all users', async () => {
      await User.create([
        { fullName: 'John Doe', email: 'john@example.com', passwordHash: 'hashedpassword', phoneNumber: '1234567890' },
        { fullName: 'Jane Doe', email: 'jane@example.com', passwordHash: 'hashedpassword', phoneNumber: '0987654321' }
      ]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer validToken'); // Assuming you have a way to generate a valid token for testing

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should fetch a single user by ID', async () => {
      const user = await User.create({
        fullName: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        phoneNumber: '1234567890'
      });

      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', 'Bearer validToken'); // Assuming you have a way to generate a valid token for testing

      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(user._id.toString());
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .get('/api/users/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer validToken'); // Assuming you have a way to generate a valid token for testing

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({
        fullName: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        phoneNumber: '1234567890'
      });

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .send({
          fullName: 'John Updated',
          phoneNumber: '0987654321'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.fullName).toEqual('John Updated');
      expect(res.body.phoneNumber).toEqual('0987654321');
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .put('/api/users/507f1f77bcf86cd799439011')
        .send({
          fullName: 'John Updated',
          phoneNumber: '0987654321'
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({
        fullName: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        phoneNumber: '1234567890'
      });

      const res = await request(app)
        .delete(`/api/users/${user._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('User deleted successfully');

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .delete('/api/users/507f1f77bcf86cd799439011');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('User not found');
    });
  });
});