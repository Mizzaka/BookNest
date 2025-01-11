import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import axios from "axios";

const LibrarianForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    branchName: "", // Initialize with an empty string
  });

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }
  
        const response = await axios.get("http://localhost:5000/api/branches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Fetched Branches:", response.data); // Add this log
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBranches();
  }, []);
  

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  

 // In LibrarianForm, modify the onSubmit handling:

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Librarian Data Submitted:", formData);
  onSubmit(formData);  // <-- Pass formData to parent component's onSubmit
  onClose(); // Close the form dialog
};


  if (loading) {
    return <div>Loading branches...</div>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
      <TextField
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="contactNumber"
        label="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
     <TextField
  select
  name="branchName"
  label="Branch Name"
  value={formData.branchName || ""}
  onChange={handleChange}
  fullWidth
  required
  margin="normal"
  SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 200, // Optional: Set dropdown height
        },
      },
    },
  }}
>
  {branches.length > 0 ? (
    branches.map((branch) => (
      <MenuItem key={branch._id} value={branch.branchName || ""}>
        
        {branch.branchName}
        
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>No branches available</MenuItem>
  )}
</TextField>

      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Button type="submit" variant="contained" color="success">
          Create Librarian
        </Button>
      </Box>
    </Box>
  );
};

export default LibrarianForm;
