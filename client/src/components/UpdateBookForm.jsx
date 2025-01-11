import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UpdateBookForm = ({ onClose, initialData, onSubmit }) => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    availableCopies: 0,
    totalCopies: 0,
    coverImage: null, // To store the cover image file
  });

  // Populate form with initial data if available
  useEffect(() => {
    if (initialData) {
      setBookData({
        title: initialData.title,
        author: initialData.author,
        genre: initialData.genre,
        availableCopies: initialData.copiesAvailable,
        totalCopies: initialData.totalCopies,
        coverImage: null, // Reset for new upload
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first file
    if (file) {
      setBookData((prevData) => ({ ...prevData, coverImage: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Append all fields that have values
    if (bookData.title) formData.append("title", bookData.title);
    if (bookData.author) formData.append("author", bookData.author);
    if (bookData.genre) formData.append("genre", bookData.genre);
    if (bookData.availableCopies !== undefined)
      formData.append("availableCopies", bookData.availableCopies);
    if (bookData.totalCopies !== undefined)
      formData.append("totalCopies", bookData.totalCopies);
  
    // Include cover image only if it's updated
    if (bookData.coverImage) {
      formData.append("coverImage", bookData.coverImage);
    }
  
    // Debugging: Log the FormData contents
    console.log(
      "FormData to be sent:",
      Array.from(formData.entries()).map(([key, value]) => `${key}: ${value}`)
    );
  
    // Pass FormData to parent for API submission
    onSubmit(formData);
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Edit Book
        </Typography>

        {/* Image Upload Section */}
        <Typography variant="body1">Update Cover Image</Typography>
        <Box
          sx={{
            border: "2px dashed #aaa",
            borderRadius: "8px",
            textAlign: "center",
            padding: "20px",
            marginBottom: 2,
          }}
        >
          <input
            type="file"
            style={{ display: "none" }}
            id="coverImageInput"
            onChange={handleImageUpload}
          />
          <label htmlFor="coverImageInput" style={{ cursor: "pointer" }}>
            <CloudUploadIcon fontSize="large" />
            <Typography variant="body2">
              {bookData.coverImage
                ? bookData.coverImage.name
                : "Drag and drop or choose file"}
            </Typography>
          </label>
        </Box>

        {/* Form Fields */}
        <TextField
          label="Title"
          name="title"
          value={bookData.title}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Author"
          name="author"
          value={bookData.author}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Genre"
          name="genre"
          value={bookData.genre}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Available Copies"
          name="availableCopies"
          type="number"
          value={bookData.availableCopies}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Total Copies"
          name="totalCopies"
          type="number"
          value={bookData.totalCopies}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "20px" }}
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit">
          Update Book
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default UpdateBookForm;
