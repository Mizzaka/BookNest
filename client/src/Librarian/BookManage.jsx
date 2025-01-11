import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Typography from "@mui/material/Typography";
import { Grid, Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TotalCard from "../components/TotalCard";
import BookTable from "../components/BookTable";
import LibrarianBookForm from "../components/LibrarianComponents/LibrarianBookForm";
import UpdateBookForm from "../components/UpdateBookForm";
import axios from "axios";

const BookManage = () => {
  const [open, setOpen] = useState(false); // Add Book Dialog
  const [updateOpen, setUpdateOpen] = useState(false); // Update Book Dialog
  const [selectedBook, setSelectedBook] = useState(null); // Selected book for editing
  const [books, setBooks] = useState([]); // List of books
  const [librarianName, setLibrarianName] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch branch books from the backend
  const fetchBranchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books/librarian/branch", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching branch books:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch librarian name from localStorage
  useEffect(() => {
    const storedLibrarianName = localStorage.getItem("librarianName") || "Librarian";
    setLibrarianName(storedLibrarianName);
    fetchBranchBooks(); // Load books when the page loads
  }, []);

  // Handlers for Dialogs
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (book) => {
    setSelectedBook(book);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setSelectedBook(null);
  };

  // Add a new book (triggered in LibrarianBookForm)
  const handleAddBook = async (newBook) => {
    try {
      const response = await axios.post("http://localhost:5000/api/books/librarian/add", newBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Book added successfully!");
      setBooks((prevBooks) => [...prevBooks, response.data.book]);
      handleClose();
    } catch (error) {
      console.error("Error adding book:", error.response?.data?.message || error.message);
    }
  };

  // Update an existing book (triggered in UpdateBookForm)
  const handleUpdateBook = async (updatedBook) => {
    try {
      const response = await axios.put(`/api/books/${selectedBook.id}`, updatedBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? response.data.book : book
        )
      );
      handleUpdateClose();
    } catch (error) {
      console.error("Error updating book:", error.response?.data?.message || error.message);
    }
  };

  const bookColumns = [
    { field: "title", title: "Title" },
    { field: "author", title: "Author" },
    { field: "genre", title: "Genre" },
    { field: "copiesAvailable", title: "Available Copies" },
    { field: "totalCopies", title: "Total Copies" },
  ];

  return (
    <>
      <AdminNavbar />
      <Box sx={{ padding: "40px" }}>
        {/* Greeting Message */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}
        >
          Hello {librarianName},
        </Typography>

        {/* Cards Section */}
        <Grid container spacing={3} sx={{ marginBottom: 4, marginLeft: 1 }}>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Total Books" value={books.length} color="#34A853" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Active Reservations" value="200" color="#34A853" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Borrowed Books" value="200" color="#34A853" />
          </Grid>
        </Grid>

        {/* Manage Books Section */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, marginBottom: 0, marginTop: 8, fontSize: 28 }}
        >
          Book Manage
        </Typography>
        <div
          style={{
            textAlign: "right",
            marginBottom: "20px",
            marginRight: "30px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Book
          </Button>

          {/* Add Book Dialog */}
          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogContent>
              <LibrarianBookForm onSubmit={handleAddBook} onClose={handleClose} />
            </DialogContent>
          </Dialog>

          {/* Update Book Dialog */}
          <Dialog open={updateOpen} onClose={handleUpdateClose} fullWidth>
            <DialogTitle>Update Book</DialogTitle>
            <DialogContent>
              {selectedBook && (
                <UpdateBookForm
                  initialData={selectedBook}
                  onSubmit={handleUpdateBook}
                  onClose={handleUpdateClose}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Book Table */}
        {!loading && books.length > 0 ? (
          <BookTable
            data={books}
            columns={bookColumns}
            onEdit={handleUpdateOpen}
            onDeleteSuccess={(deletedId) =>
              setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedId))
            }
          />
        ) : (
          !loading && <Typography>No books found.</Typography>
        )}
      </Box>
    </>
  );
};

export default BookManage;
