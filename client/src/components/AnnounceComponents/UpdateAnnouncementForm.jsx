import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

const UpdateAnnouncementForm = ({ initialData, onSubmit, onClose }) => {
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
        name="title"
        label="Announcement Title"
        value={formData.title || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="content"
        label="Announcement Content"
        value={formData.content || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        multiline
        rows={4} // Adjust for content input height
      />
      <Box sx={{ textAlign: "right", marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Update Announcement
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateAnnouncementForm;
