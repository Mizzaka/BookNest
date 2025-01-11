import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import BookTable from "../components/BookTable";
import AddIcon from "@mui/icons-material/Add";
import AdminNavbar from "../components/AdminNavbar";
import { Grid } from "@mui/material";
import TotalCard from "../components/TotalCard";
import Box from "@mui/material/Box";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import BookForm from "../components/BookForm";
import UpdateBookForm from "../components/UpdateBookForm";
import axios from "axios"; // Import Axios

const AdminDashboard = () => {
  const [books, setBooks] = useState([]); // Initialize books as an empty array
  const [loading, setLoading] = useState(true); // Add a loading state
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false); // For Update Dialog
  const [selectedBook, setSelectedBook] = useState(null); // For storing the book to be updated

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books");
        console.log("Fetched books:", response.data); // Log the fetched data
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error.message);
      } finally {
        setLoading(false); // Ensure loading is stopped
      }
    };
  
    fetchBooks();
  }, []);
  

  const handleAddBook = async (bookData) => {
    console.log("Adding book:", bookData);
  
    try {
      const response = await axios.post("http://localhost:5000/api/books", bookData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      console.log("Book added:", response.data);
  
      setBooks((prevBooks) => [...prevBooks, response.data]); 
      setOpen(false); 
    } catch (error) {
      console.error("Error adding book:", error.message || error.response?.data);
    }
  };
  
  
  const handleUpdateBook = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/books/${selectedBook._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Update books state with the updated book
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === selectedBook._id ? response.data : book
        )
      );
  
      alert("Book updated successfully!");
      setUpdateOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error updating book:", error.response?.data || error.message);
      alert("Failed to update book. Please try again.");
    }
  };
  
  
  




  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (book) => {
    setSelectedBook(book);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  const bookColumns = [
    { field: "title", title: "Title" },
    { field: "author", title: "Author" },
    { field: "genre", title: "Genre" },
    { field: "copiesAvailable", title: "Available Copies" },
    { field: "totalCopies", title: "Total Copies" },
  ];


  const [adminName, setAdminName] = useState("");

  // Fetch admin name (simulate fetching from an API or localStorage)
  useEffect(() => {
    // Replace with your actual logic to get the admin's name
    const storedAdminName = localStorage.getItem("adminName") || "Kasun";
    setAdminName(storedAdminName);
  }, []);

  // Handle Edit Button click in BookTable
  const handleEdit = (book) => {
    setSelectedBook(book); // Set the selected book data
    handleOpen(); // Open the BookForm dialog
  };

  return (
    <>
      <AdminNavbar />

      <Box sx={{ padding: "40px" }}>
        {/* Greeting Message */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}
        >
          Hello {adminName},
        </Typography>

        <Grid container spacing={3} sx={{ marginBottom: 4, marginLeft: 1 }}>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Total Books"  value={books.length} color="#34A853" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Total Patrons" value="550" color="#34A853" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TotalCard
              title="Active Reservations"
              value="200"
              color="#34A853"
            />
          </Grid>
        </Grid>

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
            onClick={() => setOpen(true)}>
          
            Add Book
          </Button>

          {/* Add Book Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogContent>
            <BookForm
              onClose={handleClose}
              onSubmit={(newBook) => handleAddBook(newBook)}
            />
          </DialogContent>
        </Dialog>
        {/* Update Book Dialog */}
        <Dialog open={updateOpen} onClose={handleUpdateClose} fullWidth>
          <DialogTitle>Update Book</DialogTitle>
          <DialogContent>
            {selectedBook && (
              <UpdateBookForm
              initialData={selectedBook}
              onClose={handleUpdateClose}
              onSubmit={(formData) => handleUpdateBook(formData)} // Pass formData to handleUpdateBook
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
    onDeleteSuccess={(deletedId) => {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedId));
    }}
  />
) : (
  !loading && <Typography>No books found.</Typography> // Display a message if no books are fetched
)}
      </Box>
    </>
  );
};

export default AdminDashboard;
