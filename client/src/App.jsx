import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client"; // Import socket.io-client
import Home from "./Home";
import Admin from "./Admin/Admin";
import LibrarianManage from "./Admin/LibrarianManage";
import BranchManage from "./Admin/BranchManage";
import AnnouncementManage from "./Admin/AnnouncementManage";
import BookManage from "./Librarian/BookManage";
import ReservationsManage from "./Librarian/ReservationsManage";
import BorrowedListManage from "./Librarian/BorrowedListManage";
import LoginForm from "./components/LoginForm";
import BookPreview from "./components/BookPreview";
import MyShelf from "./MyShelf";
import Register from "./components/register";



const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [isConnected, setIsConnected] = useState(false); // State for WebSocket connection

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
    }

    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [authToken, role]);

  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    const socket = io("http://localhost:5000");

    // Listen for the 'connect' event
    socket.on("connect", () => {
      console.log("Connected to the WebSocket server");
      setIsConnected(true);
    });

    // Listen for the 'disconnect' event
    socket.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
      setIsConnected(false);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    setRole(null);
    alert("You have been logged out!");
  };

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!authToken) {
      return <Navigate to="/" />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        
        <Routes>
          <Route
            path="/login"
            element={<LoginForm setAuthToken={setAuthToken} setRole={setRole} />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/librarianmanage"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <LibrarianManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/branchmanage"
            element={
              <PrivateRoute allowedRoles={["admin", "librarian"]}>
                <BranchManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/announcementsmanage"
            element={
              <PrivateRoute allowedRoles={["admin", "librarian"]}>
                <AnnouncementManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookmanage"
            element={
              <PrivateRoute allowedRoles={["librarian"]}>
                <BookManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservationsmanage"
            element={
              <PrivateRoute allowedRoles={["librarian"]}>
                <ReservationsManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/borrowed"
            element={
              <PrivateRoute allowedRoles={["librarian"]}>
                <BorrowedListManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookpreview/:id"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <BookPreview />
              </PrivateRoute>
            }
          />
          <Route
            path="/myshelf"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <MyShelf />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
