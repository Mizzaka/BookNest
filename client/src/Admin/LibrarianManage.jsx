import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LibrarianTable from "../components/LibrarianComponents/LibrarianComponents/LibrarianTable";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import TotalCard from "../components/TotalCard";
import LibrarianForm from "../components/LibrarianForm"; 
import UpdateLibrarianForm from "../components/UpdateLibrarianForm";

const LibrarianManage = () => {
  const [librarians, setLibrarians] = useState([]);
  const [branches, setBranches] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);

  // Fetch librarians
  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/librarians", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLibrarians(response.data);
      } catch (error) {
        console.error("Error fetching librarians:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrarians();
  }, []);

  // Handle adding librarian
  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/librarians",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Librarian Created successfully!");
      
      console.log("Librarian Created:", response.data);
      setLibrarians((prevLibrarians) => [...prevLibrarians, response.data]); // Add the new librarian to the state
      setOpen(false); // Close the form dialog
    } catch (error) {
      console.error("Error creating librarian:", error.response?.data || error.message);
    }
  };
  
  // Handle editing librarian
  const handleUpdateLibrarian = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/librarians/${selectedLibrarian._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLibrarians((prevLibrarians) =>
        prevLibrarians.map((librarian) =>
          librarian._id === selectedLibrarian._id ? response.data : librarian
        )
      );
      setUpdateOpen(false); // Close the update dialog
    } catch (error) {
      console.error("Error updating librarian:", error.message || error.response?.data);
    }
  };

  // Handle delete librarian
  const handleDeleteLibrarian = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/librarians/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLibrarians((prevLibrarians) => prevLibrarians.filter((librarian) => librarian._id !== id));
    } catch (error) {
      console.error("Error deleting librarian:", error.message || error.response?.data);
    }
  };

  const librarianColumns = [
    { field: "firstName", title: "First Name" },
    { field: "lastName", title: "Last Name" },
    { field: "contactNumber", title: "Contact Number" },
    { field: "branchName", title: "Branch" },
    { field: "email", title: "Email" },
  ];

  return (
    <>
      <AdminNavbar />
      <Box sx={{ padding: "40px" }}>
        <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}>
          Librarian Management
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Total Librarians" value={librarians.length} color="#34A853" />
          </Grid>
        </Grid>

        <div style={{ textAlign: "right", marginBottom: "20px", marginRight: "30px" }}>
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Librarian
          </Button>
        </div>

        {/* Add Librarian Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Add New Librarian</DialogTitle>
          <DialogContent>
            <LibrarianForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>

        <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)} fullWidth>
  <DialogTitle>Update Librarian</DialogTitle>
  <DialogContent>
    {selectedLibrarian ? (
      <UpdateLibrarianForm
        initialData={selectedLibrarian}
        branches={branches}  // Ensure branches are passed as well
        onClose={() => setUpdateOpen(false)}
        onSubmit={handleUpdateLibrarian}
      />
    ) : (
      <Typography>Loading...</Typography>
    )}
  </DialogContent>
</Dialog>


        {/* Librarian Table */}
        {!loading && librarians.length > 0 ? (
          <LibrarianTable
            data={librarians}
            columns={librarianColumns}
            onEdit={(librarian) => {
              setSelectedLibrarian(librarian);
              setUpdateOpen(true);
            }}
            onDeleteSuccess={(id) => {
              setLibrarians((prevLibrarians) => prevLibrarians.filter((librarian) => librarian._id !== id));
            }}
          />
        ) : (
          !loading && <Typography>No librarians found.</Typography>
        )}
      </Box>
    </>
  );
};

export default LibrarianManage;
