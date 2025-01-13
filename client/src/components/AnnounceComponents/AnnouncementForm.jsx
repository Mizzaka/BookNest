import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const AnnouncementForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
        name="title"
        label="Announcement Title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="content"
        label="Announcement Content"
        value={formData.content}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        multiline
        rows={4} // Adjust the height for content input
      />
      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Add Announcement
        </Button>
      </Box>
    </Box>
  );
};

export default AnnouncementForm;
