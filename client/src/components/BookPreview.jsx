import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../components/Footer/Footer";
import {
  Typography,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";

// Styled Material-UI components
const Search = styled(Box)({
  borderRadius: "2rem",
  border: "2px solid rgb(12, 57, 155)",
  backgroundColor: "#fff",
  boxShadow: "0px 2px 4px rgba(20, 101, 194, 0.1)",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  width: "20rem",
  height: "2rem",
});

const SearchIconWrapper = styled(Box)({
  marginRight: "8px",
  color: "rgb(12, 57, 155)",
  display: "flex",
  alignItems: "center",
});

const StyledInputBase = styled(InputBase)({
  color: "#7f7f7f",
  fontSize: "0.9rem",
  flex: 1,
  "& .MuiInputBase-input": {
    width: "100%",
    height: "100%",
    padding: 0,
  },
});

function BookPreview() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // State to hold book data
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedBranch, setSelectedBranch] = useState(""); // Selected branch
  const [availableCopies, setAvailableCopies] = useState([]); // Available copies in selected branch
  const [selectedCopyId, setSelectedCopyId] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for errors
  const [availableCopyCount, setAvailableCopyCount] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/books/${id}`
        );
        setBook(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/branches");
        setBranches(response.data);
      } catch (err) {
        setError("Failed to fetch branches");
      }
    };

    fetchBookDetails();
    fetchBranches();
  }, [id]);

  useEffect(() => {
    const fetchAvailableCopies = async () => {
      if (selectedBranch) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/books/${id}/copies?branch=${selectedBranch}`
          );
          const availableCopies = response.data.copies.filter(
            (copy) => copy.status === "available"
          );
          setAvailableCopies(availableCopies);
          setAvailableCopyCount(availableCopies.length);
        } catch (err) {
          setError("Failed to fetch available copies");
        }
      }
    };

    fetchAvailableCopies();
  }, [selectedBranch, id]);

  const handleReserve = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedCopyId) {
      console.error(
        "No token or copy selected. Please log in and select a copy."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookCopyId: selectedCopyId,
          branchId: selectedBranch,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Reservation failed:", error.message);
        return;
      }

      const data = await response.json();
      console.log("Reservation successful:", data);
    } catch (error) {
      console.error("An error occurred while reserving the book:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />

      {/* Search bar container */}
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "50px",
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1800px",
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search by book name, Author, Subject"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>

      {/* Book preview content */}
      <Box
        sx={{
          minHeight: "100vh",
          padding: "50px 20px",
          paddingTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "40px",
            maxWidth: "1300px",
            width: "100%",
            backgroundColor: "#fff",
            padding: "40px",
          }}
        >
          <Box>
            <img
              src={book.coverImageURL || "/default-image.png"}
              alt={book.title}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "5px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", marginLeft:"40px" }}>
            <Typography
              variant="h1"
              sx={{ fontSize: "3.5rem", color: "#333", marginBottom: "20px" }}
            >
              {book.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.3rem", color: "#555", marginBottom: "20px" }}
            >
              By{" "}
              <span style={{ color: "#0066cc", textDecoration: "underline" }}>
                {book.author}
              </span>
            </Typography>
            <Box sx={{ marginBottom: "20px" , marginTop:"20px",}}>
              <Typography sx={{fontSize: "1.1rem"}}>
                <strong>Genre:</strong> {book.genre}
              </Typography>
              <Typography sx={{fontSize: "1.1rem"}}>
                <strong>Publisher:</strong> {book.publisher}
              </Typography>
              <Typography sx={{fontSize: "1.1rem"}}>
                <strong>Published Year:</strong> {book.publishedYear}
              </Typography>
              <Typography sx={{fontSize: "1.1rem"}}>
                <strong>ISBN:</strong> {book.isbn}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "30px",
              }}
            >
              <label htmlFor="branch">
                <strong>Branch:</strong>
              </label>

              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ maxWidth: "200px" }}
              >
                <MenuItem value="" disabled>
                  Select Branch
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch._id} value={branch.branchName}>
                    {branch.branchName}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={selectedCopyId}
                onChange={(e) => setSelectedCopyId(e.target.value)}
                displayEmpty
                fullWidth
                disabled={availableCopies.length === 0}
                sx={{ maxWidth: "200px" }}
              >
                <MenuItem value="" disabled>
                  Select Copy
                </MenuItem>
                {availableCopies.map((copy) => (
                  <MenuItem key={copy._id} value={copy._id}>
                    {copy.copyNumber} - {copy.status}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                onClick={handleReserve}
                disabled={
                  !selectedCopyId ||
                  availableCopies.length === 0 ||
                  !selectedBranch
                }
                sx={{
                  padding: "14px 15px",
                  backgroundColor: "green",
                  color: "white",
                  borderRadius: "5px",
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Reserve
              </Button>
            </Box>
            <Box sx={{ marginTop: "30px", lineHeight: 1.8 , }}>
              <Typography
                variant="h2"
                sx={{ fontSize: "1.9rem", marginBottom: "10px" , marginTop:"20px" }}
              >
                Description:
              </Typography>
              <Typography 
              sx={{fontSize:"1.2rem", maxWidth:"600px", marginTop:"20px"}}
              >{book.description}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}

export default BookPreview;
