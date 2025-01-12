const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
const app = require('../../app'); // Adjust the path as necessary
const Branch = require('../../models/Branch');
const User = require('../../models/User');

// Mock Multer S3 Middleware
jest.mock('multer-s3', () => {
  return () => ({
    single: () => (req, res, next) => {
      req.file = { location: 'https://mock-s3-url.com/image.jpg' }; // Mocked S3 file URL
      next();
    },
  });
});

// Mock authentication middleware
jest.mock('../../middleware/authMiddleware', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { id: 'mockUserId', role: 'admin' }; // Mock authenticated user
    next();
  },
  authorizeRole: (role) => (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  },
}));

jest.setTimeout(30000);

describe('Branch Endpoints', () => {
  let adminToken;

  beforeAll(async () => {
    console.time('beforeAll'); // Start timer
    try {
      await connectTestDB();

      // Create a test admin user
      const adminUser = await User.create({
        fullName: 'Test Admin',
        email: 'admin@example.com',
        passwordHash: 'hashedpassword',
        role: 'admin',
        phoneNumber: '1234567890',
      });

      // Generate a mock token for the admin user
      adminToken = 'validAdminToken';
    } catch (err) {
      console.error('Error in beforeAll:', err);
    } finally {
      console.timeEnd('beforeAll'); // End timer
    }
  });

  afterAll(async () => {
    console.time('afterAll');
    try {
      await disconnectTestDB();
    } catch (err) {
      console.error('Error in afterAll:', err);
    } finally {
      console.timeEnd('afterAll');
    }
  });

  afterEach(async () => {
    try {
      await Branch.deleteMany({});
    } catch (err) {
      console.error('Error in afterEach:', err);
    }
  });

  describe('GET /api/branches', () => {
    it('should fetch all branches', async () => {
      // Create test branches
      await Branch.create({
        branchName: 'Test Branch 1',
        location: 'Test Location 1',
        contactNumber: '1234567890',
      });

      await Branch.create({
        branchName: 'Test Branch 2',
        location: 'Test Location 2',
        contactNumber: '0987654321',
      });

      const res = await request(app).get('/api/branches');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('GET /api/branches/:id', () => {
    it('should fetch a single branch by ID (admin only)', async () => {
      const branch = await Branch.create({
        branchName: 'Test Branch',
        location: 'Test Location',
        contactNumber: '1234567890',
      });

      const res = await request(app)
        .get(`/api/branches/${branch._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.branchName).toEqual('Test Branch');
    });

    it('should return 404 if branch not found', async () => {
      const res = await request(app)
        .get('/api/branches/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Branch not found');
    });
  });

  describe('POST /api/branches', () => {
    it('should create a new branch (admin only)', async () => {
      const res = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          branchName: 'New Branch',
          location: 'New Location',
          contactNumber: '1234567890',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.branchName).toEqual('New Branch');
    });
  });

  describe('PUT /api/branches/:id', () => {
    it('should update a branch (admin only)', async () => {
      const branch = await Branch.create({
        branchName: 'Test Branch',
        location: 'Test Location',
        contactNumber: '1234567890',
      });

      const res = await request(app)
        .put(`/api/branches/${branch._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          branchName: 'Updated Branch',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.branchName).toEqual('Updated Branch');
    });

    it('should return 404 if branch not found', async () => {
      const res = await request(app)
        .put('/api/branches/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          branchName: 'Updated Branch',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Branch not found');
    });
  });

  describe('DELETE /api/branches/:id', () => {
    it('should delete a branch (admin only)', async () => {
      const branch = await Branch.create({
        branchName: 'Test Branch',
        location: 'Test Location',
        contactNumber: '1234567890',
      });

      const res = await request(app)
        .delete(`/api/branches/${branch._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Branch deleted successfully');
    });

    it('should return 404 if branch not found', async () => {
      const res = await request(app)
        .delete('/api/branches/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Branch not found');
    });
  });
});
