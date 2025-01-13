const { connectTestDB, disconnectTestDB } = require("../test-db-setup");
const User = require("../../models/User");
jest.setTimeout(10000); // Set timeout to 10 seconds



beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

describe("User Model Tests", () => {
    afterEach(async () => {
        await User.deleteMany({}); // Clear users after each test
    });

    test("Should create a user with valid data", async () => {
        const userData = {
            fullName: "John Doe",
            email: "john.doe@example.com",
            passwordHash: "hashedpassword123",
            phoneNumber: "+1234567890",
            role: "user",
        };

        const user = await User.create(userData);

        expect(user.fullName).toBe(userData.fullName);
        expect(user.email).toBe(userData.email);
        expect(user.passwordHash).toBe(userData.passwordHash);
        expect(user.phoneNumber).toBe(userData.phoneNumber);
        expect(user.role).toBe(userData.role);
    });

    test("Should fail to create a user with invalid data", async () => {
        try {
            await User.create({ email: "invalid" }); // Missing required fields
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors.fullName).toBeDefined();
            expect(error.errors.passwordHash).toBeDefined();
        }
    });
});
