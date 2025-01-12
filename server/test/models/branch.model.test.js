const mongoose = require("mongoose");
const Branch = require("../../models/Branch");
const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
jest.setTimeout(10000); // Set timeout to 10 seconds

describe("Branch Model Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await Branch.deleteMany(); // Clear the database after each test
  });

  test("Should create a branch with valid data", async () => {
    const validBranch = await Branch.create({
      branchName: "Central Library",
      location: "123 Library Lane, Booktown",
      contactNumber: "+1234567890",
    });

    expect(validBranch).toBeDefined();
    expect(validBranch.branchName).toBe("Central Library");
    expect(validBranch.location).toBe("123 Library Lane, Booktown");
    expect(validBranch.contactNumber).toBe("+1234567890");
    expect(validBranch.librarians).toEqual([]); // Should default to an empty array
  });

  test("Should fail to create a branch without required fields", async () => {
    try {
      await Branch.create({
        location: "123 Library Lane, Booktown", // Missing branchName and contactNumber
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.branchName).toBeDefined();
      expect(error.errors.contactNumber).toBeDefined();
    }
  });

  test("Should validate the contactNumber format", async () => {
    try {
      await Branch.create({
        branchName: "Eastside Library",
        location: "456 Story Ave, Booktown",
        contactNumber: "invalidPhone", // Invalid phone number
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.contactNumber).toBeDefined();
    }
  });

  test("Should allow adding librarians to a branch", async () => {
    const librarianId1 = new mongoose.Types.ObjectId();
    const librarianId2 = new mongoose.Types.ObjectId();

    const branch = await Branch.create({
      branchName: "Westside Library",
      location: "789 Novel Rd, Booktown",
      contactNumber: "+9876543210",
      librarians: [librarianId1, librarianId2], // Adding librarian references
    });

    expect(branch.librarians).toHaveLength(2);
    expect(branch.librarians).toContainEqual(librarianId1);
    expect(branch.librarians).toContainEqual(librarianId2);
  });

  test("Should trim whitespace from branchName and location", async () => {
    const branch = await Branch.create({
      branchName: "   Northside Library   ",
      location: "   321 Fiction Blvd, Booktown   ",
      contactNumber: "+1122334455",
    });

    expect(branch.branchName).toBe("Northside Library");
    expect(branch.location).toBe("321 Fiction Blvd, Booktown");
  });

  test("Should include timestamps when creating a branch", async () => {
    const branch = await Branch.create({
      branchName: "Southside Library",
      location: "654 Fantasy Dr, Booktown",
      contactNumber: "+2233445566",
    });

    expect(branch.createdAt).toBeDefined();
    expect(branch.updatedAt).toBeDefined();
  });

  test("Should update branch information successfully", async () => {
    const branch = await Branch.create({
      branchName: "Old Library",
      location: "111 Old St, Booktown",
      contactNumber: "+9988776655",
    });

    branch.branchName = "New Library";
    branch.location = "222 New St, Booktown";
    await branch.save();

    const updatedBranch = await Branch.findById(branch._id);
    expect(updatedBranch.branchName).toBe("New Library");
    expect(updatedBranch.location).toBe("222 New St, Booktown");
  });

  test("Should not allow duplicate branch names", async () => {
    await Branch.create({
      branchName: "Unique Library",
      location: "444 Unique Ln, Booktown",
      contactNumber: "+1234567890",
    });

    try {
      await Branch.create({
        branchName: "Unique Library", // Duplicate branch name
        location: "555 Another Ln, Booktown",
        contactNumber: "+9876543210",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/duplicate key error/i); // MongoDB duplicate key error
    }
  });
});
