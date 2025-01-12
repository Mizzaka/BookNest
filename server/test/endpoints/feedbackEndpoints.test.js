const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
const app = require('../../app'); // Adjust the path as necessary
const Feedback = require('../../models/feedback');

jest.mock('multer-s3', () => {
    return () => ({
      single: () => (req, res, next) => {
        req.file = { location: 'https://mock-s3-url.com/image.jpg' }; // Mocked S3 file URL
        next();
      },
    });
  });
  
  jest.setTimeout(30000);

describe('Feedback Endpoints', () => {
  beforeAll(async () => {
    console.time('beforeAll'); // Start timer
    await connectTestDB();
    console.timeEnd('beforeAll'); // End timer and log duration
  });

  afterAll(async () => {
    console.time('afterAll');
    await disconnectTestDB();
    console.timeEnd('afterAll');
  });

  afterEach(async () => {
    await Feedback.deleteMany({}); // Clear the Feedback collection after each test
  });

  describe('POST /api/feedback', () => {
    it('should create a new feedback', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({
          name: 'Test User',
          feedback: 'This is a test feedback.',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('Test User');
      expect(res.body.feedback).toEqual('This is a test feedback.');
    });

    it('should return 400 if name or feedback is missing', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({
          name: '', // Missing name
          feedback: 'This is a test feedback.',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Name and feedback are required');
    });
  });

  describe('GET /api/feedback', () => {
    it('should fetch all feedbacks', async () => {
      // Create test feedbacks
      await Feedback.create({
        name: 'Test User 1',
        feedback: 'This is feedback 1.',
      });

      await Feedback.create({
        name: 'Test User 2',
        feedback: 'This is feedback 2.',
      });

      const res = await request(app).get('/api/feedback');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);

      // Check for the presence of feedbacks without assuming order
      const feedbackNames = res.body.map((feedback) => feedback.name);
      expect(feedbackNames).toContain('Test User 1');
      expect(feedbackNames).toContain('Test User 2');
    });
  });

  describe('PUT /api/feedback/:id', () => {
    it('should update a feedback by ID', async () => {
      const feedback = await Feedback.create({
        name: 'Test User',
        feedback: 'This is a test feedback.',
      });

      const res = await request(app)
        .put(`/api/feedback/${feedback._id}`)
        .send({
          name: 'Updated User',
          feedback: 'This is an updated feedback.',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Updated User');
      expect(res.body.feedback).toEqual('This is an updated feedback.');
    });

    it('should return 400 if name or feedback is missing', async () => {
      const feedback = await Feedback.create({
        name: 'Test User',
        feedback: 'This is a test feedback.',
      });

      const res = await request(app)
        .put(`/api/feedback/${feedback._id}`)
        .send({
          name: '', // Missing name
          feedback: 'This is an updated feedback.',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Name and feedback are required');
    });

    it('should return 404 if feedback not found', async () => {
      const res = await request(app)
        .put('/api/feedback/507f1f77bcf86cd799439011') // Invalid ID
        .send({
          name: 'Updated User',
          feedback: 'This is an updated feedback.',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Feedback not found');
    });
  });

  describe('DELETE /api/feedback/:id', () => {
    it('should delete a feedback by ID', async () => {
      const feedback = await Feedback.create({
        name: 'Test User',
        feedback: 'This is a test feedback.',
      });

      const res = await request(app).delete(`/api/feedback/${feedback._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Feedback deleted successfully');
    });

    it('should return 404 if feedback not found', async () => {
      const res = await request(app).delete('/api/feedback/507f1f77bcf86cd799439011'); // Invalid ID

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Feedback not found');
    });
  });
});