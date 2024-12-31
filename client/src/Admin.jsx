import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import BookTable from "./components/BookTable";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "./components/Navbar";
import { Grid } from "@mui/material";
import TotalCard from "./components/TotalCard";
import Box from "@mui/material/Box";
import Footer from "./components/Footer/Footer";

const AdminDashboard = () => {
  const books = [
    { id: 1, title: "Ice And Fire", author: "G. Martin", genre: "Fantasy", availableCopies: 5, totalCopies: 10 },
    { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Adventure", availableCopies: 3, totalCopies: 8 },
    // Add more book objects
  ];

  const [adminName, setAdminName] = useState("");

  // Fetch admin name (simulate fetching from an API or localStorage)
  useEffect(() => {
    // Replace with your actual logic to get the admin's name
    const storedAdminName = localStorage.getItem("adminName") || "Kasun";
    setAdminName(storedAdminName);
  }, []);


  return (
    <>
    <Navbar />

    <Box sx={{ padding: "40px" }}>

      {/* Greeting Message */}
      <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}>
        Hello {adminName},
      </Typography>

    <Grid container spacing={3} sx={{ marginBottom: 4 , marginLeft: 1}}>
      <Grid item xs={12} sm={4}>
        <TotalCard title="Total Books" value="125" color="#34A853" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TotalCard title="Total Patrons" value="550" color="#34A853" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TotalCard title="Active Reservations" value="200" color="#34A853" />
      </Grid>
    </Grid>
      
      <Typography variant="h4" sx={{ fontWeight: 800, marginBottom: 0, marginTop: 8, fontSize: 28 }}>
      Book Manage
      </Typography>
      <div style={{ textAlign: "right", marginBottom: "20px", marginRight: "30px" }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
        >
          Add Book
        </Button>
      </div>
      <BookTable books={books} />
</Box>
    <Footer />
    </>
  );
};

export default AdminDashboard;
