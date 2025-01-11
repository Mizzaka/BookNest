require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // Required for integrating Socket.IO with Express
const { Server } = require("socket.io"); // Import Socket.IO
require("./jobs"); // Import scheduled jobs if required

// Import route handlers
const branchRoutes = require("./routes/branchRoutes");
const librarianRoutes = require("./routes/librarianRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const bookLogRoutes = require("./routes/bookLogRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

// Create HTTP server for Express
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to restrict origins in production
        methods: ["GET", "POST"],
    },
});

// WebSocket event handling
io.on("connection", (socket) => {
    console.log("A user connected");

    // Example: Listen for a "new-announcement" event from clients
    socket.on("new-announcement", (data) => {
        console.log("New announcement received:", data);

        // Broadcast the announcement to all connected clients
        io.emit("update-announcement", data);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Connect to MongoDB
mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");


        // Routes
app.use("/api/branches", branchRoutes);
app.use("/api/librarians", librarianRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/booklogs", bookLogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementRoutes(io));

        // Start the server with WebSocket support
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Export the Socket.IO instance for use in other parts of the app (if needed)
module.exports = io;
