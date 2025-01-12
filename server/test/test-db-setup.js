// test-db-setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectTestDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log('Connected to test database');
    } catch (error) {
        console.error('Test database connection error:', error);
        throw error;
    }
};

const disconnectTestDB = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
        }
        console.log('Disconnected from test database');
    } catch (error) {
        console.error('Test database disconnection error:', error);
        throw error;
    }
};

module.exports = { connectTestDB, disconnectTestDB };