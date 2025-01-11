import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home"; // Import the Home component
import Admin from "./Admin";
import BookPreview from "./BookPreview";
import MyShelf from "./MyShelf";

const App = () => {
  const [selectedBookId, setSelectedBookId] = useState(null);
  // const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null); // Load token from localStorage
  // const [role, setRole] = useState(localStorage.getItem("role") || null); // User role
  const testUserId = "6759004e180635d651d78e11";

  // useEffect(() => {
  //   if (authToken) {
  //     localStorage.setItem("token", authToken);
  //   } else {
  //     localStorage.removeItem("token");
  //   }

  //   if (role) {
  //     localStorage.setItem("role", role);
  //   } else {
  //     localStorage.removeItem("role");
  //   }
  // }, [authToken, role]); // Dependency array to prevent infinite loop

  // const handleLogout = () => {
  //   setAuthToken(null);
  //   setRole(null);
  //   alert("You have been logged out!");
  // };

  return (
    <Router>
      <div>
       
        {/* {authToken ? (
          <button onClick={handleLogout}>Logout</button>
        ) : null} */}

        <Routes>
          {/* <Route
            path="/"
            element={
              authToken ? (
                <Navigate to={role === "admin" ? "/admin" : role === "librarian" ? "/librarian" : "/user"} />
              ) : (
                <LoginForm setAuthToken={setAuthToken} setRole={setRole} />
              )
            }
          /> */}
          {/* <Route
            path="/admin"
            element={
              authToken && role === "admin" ? (
                <>
                  <h2>Admin Panel</h2>
                  <BookAdd authToken={authToken} />
                </>
              ) : (
                <Navigate to="/bookadding" />
              )
            }
          /> */}
          {/* <Route
            path="/librarian"
            element={
              authToken && role === "librarian" ? (
                <>
                  <h2>Librarian Panel</h2>
                  <LibrarianReservations />
                  <BookAdd authToken={authToken} />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          /> */}
          {/* <Route
            path="/user"
            element={
              authToken && role === "user" ? (
                <>
                  {!selectedBookId ? (
                    <BooksList onBookSelect={setSelectedBookId} />
                  ) : (
                    <div>
                      <button onClick={() => setSelectedBookId(null)}>Back to Books List</button>
                      <BookDetails bookId={selectedBookId} />
                    </div>
                  )}
                  <MyShelf userId={testUserId} />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          /> */}
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/bookpreview" element={<BookPreview />} />
          <Route path="/myshelf" element={<MyShelf />} />
        </Routes>
          
      </div>
    </Router>
  );
};

export default App;
