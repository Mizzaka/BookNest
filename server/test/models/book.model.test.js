const mongoose = require("mongoose");
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
const Book = require("../../models/Book");
jest.setTimeout(10000); // Set timeout to 10 seconds


describe("Book Model Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    // Clear the Book collection after each test
    await Book.deleteMany({});
  });

  test("Should create a book with valid data", async () => {
    const validBookData = {
      title: "Test Book",
      author: "John Doe",
      genre: "Fiction",
      isbn: "1234567890",
      publishedYear: 2023,
      publisher: "Test Publisher",
      description: "A test description",
      totalCopies: 5,
      copiesAvailable: 5,
      coverImageURL: "http://example.com/cover.jpg",
      bookCopies: [
        {
          copyNumber: "1",
          status: "available",
          branch: "Main Branch",
        },
        {
          copyNumber: "2",
          status: "issued",
          branch: "Main Branch",
        },
      ],
    };

    const book = new Book(validBookData);
    const savedBook = await book.save();

    expect(savedBook._id).toBeDefined();
    expect(savedBook.title).toBe(validBookData.title);
    expect(savedBook.copiesAvailable).toBe(validBookData.copiesAvailable);
    expect(savedBook.bookCopies.length).toBe(2);
  });

  test("Should fail to create a book with missing required fields", async () => {
    const invalidBookData = {
      author: "John Doe",
      genre: "Fiction",
    };

    try {
      const book = new Book(invalidBookData);
      await book.save();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("ValidationError");
    }
  });

  test("Should correctly update copiesAvailable based on bookCopies status", async () => {
    const book = await Book.create({
      title: "Test Book",
      author: "Test Author",
      genre: "Fiction",
      isbn: "1234567890123",
      publishedYear: 2021,
      publisher: "Test Publisher",
      totalCopies: 5,
      bookCopies: [
        { copyNumber: "1", status: "available", branch: "Main" },
        { copyNumber: "2", status: "reserved", branch: "Main" },
        { copyNumber: "3", status: "issued", branch: "Main" },
        { copyNumber: "4", status: "available", branch: "Main" },
        { copyNumber: "5", status: "reserved", branch: "Main" },
      ],
    });
  
    // Call the updateCopiesAvailable method
    await book.updateCopiesAvailable();
  
    // Fetch the updated book from the database
    const updatedBook = await Book.findById(book._id);
  
    
    
  
    // Assert that copiesAvailable is calculated correctly
    expect(updatedBook.copiesAvailable).toBe(2); // 5 total - 3 reserved/issued = 2
  });
  

  test("Should ensure unique ISBNs are enforced", async () => {
    const bookData1 = {
      title: "Book One",
      author: "Author One",
      genre: "Fiction",
      isbn: "1234567890",
      publisher: "Publisher One",
    };

    const bookData2 = {
      title: "Book Two",
      author: "Author Two",
      genre: "Non-Fiction",
      isbn: "1234567890", // Duplicate ISBN
      publisher: "Publisher Two",
    };

    await new Book(bookData1).save();

    try {
      await new Book(bookData2).save();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error code
    }
  });
});
