import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const BranchForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    branchName: "",
    location: "",
    contactNumber: "",
    librarians: [], // Empty array since librarians can be added after branch creation
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the data to the parent component or API
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
      <TextField
        name="branchName"
        label="Branch Name"
        value={formData.branchName}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="location"
        label="Location"
        value={formData.location}
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
      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Create Branch
        </Button>
      </Box>
    </Box>
  );
};

export default BranchForm;
