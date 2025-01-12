const mongoose = require("mongoose");
const Reservation = require("../../models/Reservation");
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
jest.setTimeout(10000); // Set timeout to 10 seconds

describe("Reservation Model Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await Reservation.deleteMany(); // Clear database after each test
  });

  test("Should create a reservation with valid data", async () => {
    const validReservation = await Reservation.create({
      userId: new mongoose.Types.ObjectId(),
      bookCopyId: new mongoose.Types.ObjectId(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    });

    expect(validReservation).toBeDefined();
    expect(validReservation.userId).toBeDefined();
    expect(validReservation.bookCopyId).toBeDefined();
    expect(validReservation.status).toBe("active");
    expect(validReservation.reservedAt).toBeDefined();
    expect(validReservation.expiryDate).toBeInstanceOf(Date);
  });

  test("Should fail to create a reservation without required fields", async () => {
    try {
      await Reservation.create({
        bookCopyId: new mongoose.Types.ObjectId(), // Missing userId and expiryDate
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.expiryDate).toBeDefined();
    }
  });

  test("Should only allow valid status values", async () => {
    const reservation = await Reservation.create({
      userId: new mongoose.Types.ObjectId(),
      bookCopyId: new mongoose.Types.ObjectId(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: "active", // Valid status
    });

    expect(reservation.status).toBe("active");

    // Test invalid status
    try {
      await Reservation.create({
        userId: new mongoose.Types.ObjectId(),
        bookCopyId: new mongoose.Types.ObjectId(),
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: "invalidStatus", // Invalid status
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    }
  });

  test("Should automatically set reservedAt to current date", async () => {
    const now = new Date();
    const reservation = await Reservation.create({
      userId: new mongoose.Types.ObjectId(),
      bookCopyId: new mongoose.Types.ObjectId(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    });

    expect(reservation.reservedAt).toBeDefined();
    expect(new Date(reservation.reservedAt).getDate()).toBe(now.getDate()); // Same date as "now"
  });

  test("Should enforce expiryDate is a valid date", async () => {
    try {
      await Reservation.create({
        userId: new mongoose.Types.ObjectId(),
        bookCopyId: new mongoose.Types.ObjectId(),
        expiryDate: "invalidDate", // Invalid expiryDate
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.expiryDate).toBeDefined();
    }
  });

  test("Should fail if user tries to reserve the same book copy twice", async () => {
    const userId = new mongoose.Types.ObjectId();
    const bookCopyId = new mongoose.Types.ObjectId();

    // First reservation
    await Reservation.create({
      userId,
      bookCopyId,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    });

    // Second reservation for the same bookCopyId by the same user
    try {
      await Reservation.create({
        userId,
        bookCopyId,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/duplicate key error/i); // MongoDB duplicate key error
    }
  });
});
