import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

const UpdateBranchForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the updated data to the parent component or API
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
      <TextField
        name="branchName"
        label="Branch Name"
        value={formData.branchName || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="location"
        label="Location"
        value={formData.location || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
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
      {/* Display librarians as non-editable */}
      <TextField
        name="librarians"
        label="Librarians"
        value={Array.isArray(formData.librarians)
          ? formData.librarians.map((librarian) => librarian.name).join(", ")
          : ""} // Fallback to an empty string if librarians is not an array
        fullWidth
        disabled
        margin="normal"
      />
      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Update Branch
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateBranchForm;
