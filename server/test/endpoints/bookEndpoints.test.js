const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
const User = require("../../models/User");
const app = require('../../app'); // Adjust path as necessary
const Book = require('../../models/Book');
const Branch = require('../../models/Branch');
const Librarian = require('../../models/Librarian');

// Mock multer-s3 to avoid AWS S3 dependencies
jest.mock('multer-s3', () => {
  return () => ({
    single: () => (req, res, next) => {
      req.file = { location: 'https://mock-s3-url.com/image.jpg' }; // Mocked S3 file URL
      next();
    },
  });
});

jest.setTimeout(30000);

describe('Book Endpoints', () => {
  let authToken;
  let librarianToken;
  let adminToken;

  beforeAll(async () => {
    await connectTestDB();

    // Create test users, branches, and librarian
    const branch = await Branch.create({
      branchName: 'Test Branch',
      location: 'Test Location',
      contactNumber: '1234567890',
    });

    const librarianUser = await User.create({
      fullName: 'Test Librarian',
      email: 'librarian@example.com',
      passwordHash: 'hashedpassword',
      role: 'librarian',
      phoneNumber: '1234567890',
    });

    await Librarian.create({
      userId: librarianUser._id,
      branchId: branch._id,
      branchName: branch.branchName,
      firstName: 'Test',
      lastName: 'Librarian',
      email: 'librarian@example.com',
      contactNumber: '1234567890',
    });

    await User.create({
      fullName: 'Test Admin',
      email: 'admin@example.com',
      passwordHash: 'hashedpassword',
      role: 'admin',
      phoneNumber: '1234567890',
    });

    authToken = 'validUserToken';
    librarianToken = 'validLibrarianToken';
    adminToken = 'validAdminToken';
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await Book.deleteMany({});
    await Branch.deleteMany({});
  });

  describe('POST /api/books', () => {
    it('should create a new book (admin only)', async () => {
      const branch = await Branch.create({ branchName: 'Test Branch' });

      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('title', 'Test Book')
        .field('author', 'Test Author')
        .field('genre', 'Test Genre')
        .field('isbn', '1234567890')
        .field('publishedYear', 2023)
        .field('publisher', 'Test Publisher')
        .field('description', 'Test Description')
        .field('branchData', JSON.stringify([{ branchName: 'Test Branch', quantity: 5 }]))
        .attach('coverImage', 'test-image.jpg');

      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toEqual('Test Book');
      expect(res.body.coverImageURL).toEqual('https://mock-s3-url.com/image.jpg');
      expect(res.body.bookCopies.length).toEqual(5);
    });

    it('should not create a book without admin role', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Book',
          author: 'Test Author',
          genre: 'Test Genre',
          isbn: '1234567890',
          publishedYear: 2023,
          publisher: 'Test Publisher',
          description: 'Test Description',
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('POST /api/books/librarian/add', () => {
    it('should add a book to the librarian\'s branch', async () => {
      const res = await request(app)
        .post('/api/books/librarian/add')
        .set('Authorization', `Bearer ${librarianToken}`)
        .field('title', 'Librarian Book')
        .field('author', 'Librarian Author')
        .field('genre', 'Librarian Genre')
        .field('isbn', '0987654321')
        .field('publishedYear', 2023)
        .field('publisher', 'Librarian Publisher')
        .field('description', 'Librarian Description')
        .field('totalCopies', 3)
        .attach('coverImage', 'test-image.jpg');

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Book added successfully to your branch');
      expect(res.body.book.title).toEqual('Librarian Book');
      expect(res.body.book.totalCopies).toEqual(3);
    });

    it('should not add a book without librarian role', async () => {
      const res = await request(app)
        .post('/api/books/librarian/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Librarian Book',
          author: 'Librarian Author',
          genre: 'Librarian Genre',
          isbn: '0987654321',
          publishedYear: 2023,
          publisher: 'Librarian Publisher',
          description: 'Librarian Description',
          totalCopies: 3,
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/books', () => {
    it('should fetch all books', async () => {
      await Book.create({
        title: 'Test Book 1',
        author: 'Test Author 1',
        genre: 'Test Genre 1',
        coverImageURL: 'https://mock-s3-url.com/image1.jpg',
      });

      await Book.create({
        title: 'Test Book 2',
        author: 'Test Author 2',
        genre: 'Test Genre 2',
        coverImageURL: 'https://mock-s3-url.com/image2.jpg',
      });

      const res = await request(app).get('/api/books');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should fetch a single book by ID', async () => {
      const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        coverImageURL: 'https://mock-s3-url.com/image.jpg',
      });

      const res = await request(app).get(`/api/books/${book._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual('Test Book');
    });

    it('should return 404 if book not found', async () => {
      const res = await request(app).get('/api/books/507f1f77bcf86cd799439011');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Book not found');
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book (admin only)', async () => {
      const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        coverImageURL: 'https://mock-s3-url.com/image.jpg',
      });

      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('title', 'Updated Book')
        .attach('coverImage', 'test-image.jpg');

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual('Updated Book');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        coverImageURL: 'https://mock-s3-url.com/image.jpg',
      });

      const res = await request(app).delete(`/api/books/${book._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Book deleted successfully');
    });
  });
});
