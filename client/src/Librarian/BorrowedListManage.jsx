import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import TotalCard from "../components/TotalCard";
import SearchBar from "../components/SearchBar";
import BorrowedTable from '../components/LibrarianComponents/LibrarianComponents/BorrowedTable';
import axios from "axios";

const BorrowedListManage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [librarianBranch, setLibrarianBranch] = useState(""); // Add this state
  const [librarianName, setLibrarianName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const borrowedColumns = [
    { field: "bookTitle", title: "Book Title" }, // Can be added later if available in BookCopy data
    { field: "patronName", title: "Patron Name" },
    { field: "copyNumber", title: "Copy Number" },
    { field: "issueDate", title: "Issue Date" },
    { field: "dueDate", title: "Due Date" },
    { field: "status", title: "Status" },
  ];

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/api/booklogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { branch, bookLogs } = response.data;
        setLibrarianBranch(branch); // Store branch name

        setBorrowedBooks(
          bookLogs.map((log) => ({
            _id: log._id,
            bookTitle: log.book?.title || "Unknown Book",
            patronName: log.userId?.fullName || "Unknown Patron",
            copyNumber: log.book?.copyNumber || "Unknown Copy",
            issueDate: new Date(log.issueDate).toLocaleDateString() || "N/A",
            dueDate: new Date(log.dueDate).toLocaleDateString() || "N/A",
            status: log.status || "Unknown",
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
        setError("Unable to fetch borrowed books. Please try again.");
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    const storedLibrarianName = localStorage.getItem("librarianName") || "Jana";
    setLibrarianName(storedLibrarianName);
  }, []);

  const handleSearch = (query) => {
    console.log("Search query:", query);
    // Add search filtering logic here
  };

  const handleMakeActive = async (borrowedBook) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/booklogs/${borrowedBook._id}`,
        { status: "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBorrowedBooks((prevBorrowedBooks) =>
        prevBorrowedBooks.filter((book) => book._id !== borrowedBook._id)
      );

      console.log("Borrowed book marked as active.");
    } catch (error) {
      console.error("Error marking borrowed book as active:", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Box sx={{ padding: "40px" }}>
        <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}>
          Hello {librarianName},
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: 4, marginLeft: 1 }}>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Borrowed Books" value={borrowedBooks.length} color="#34A853" />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ marginTop: 6, marginBottom: 8 }}>
          <Grid item>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                marginBottom: 0,
                fontSize: 28,
              }}
            >
              Borrowed List Manage
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <SearchBar onSearch={handleSearch} />
          </Grid>
        </Grid>
        {loading ? (
          <Typography>Loading borrowed books...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <BorrowedTable
            data={borrowedBooks}
            columns={borrowedColumns}
            onMakeActive={handleMakeActive}
          />
        )}
      </Box>
    </>
  );
};

export default BorrowedListManage;
