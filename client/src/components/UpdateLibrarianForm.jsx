import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import axios from "axios";

const UpdateLibrarianForm = ({ initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    branchName: "",
  });

  const [branches, setBranches] = useState([]); // Define branches state
  const [loading, setLoading] = useState(false); // Define loading state

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true); // Start loading
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

        console.log("Fetched Branches:", response.data);
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        contactNumber: initialData.contactNumber,
        branchName: initialData.branchName,
        password: "", // Leave blank if not updating password
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Update Librarian
      </Typography>

      <TextField
        name="firstName"
        label="First Name"
        value={formData.firstName || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="lastName"
        label="Last Name"
        value={formData.lastName || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        value={formData.email || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        disabled
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData.password || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        helperText="Leave blank to keep the current password"
      />
      <TextField
        name="contactNumber"
        label="Contact Number"
        value={formData.contactNumber || ""}
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
      >
        {branches.length > 0 ? (
          branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.branchName}>
              {branch.branchName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No branches available</MenuItem>
        )}
      </TextField>

      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Update Librarian
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{ marginLeft: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateLibrarianForm;
