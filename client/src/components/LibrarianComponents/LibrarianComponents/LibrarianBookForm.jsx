import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddBookForm = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("isbn", isbn);
    formData.append("publishedYear", publishedYear);
    formData.append("publisher", publisher);
    formData.append("description", description);
    formData.append("totalCopies", totalCopies);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await onSubmit(formData); // Pass formData to parent handler
      alert("Book added successfully!");
      handleClose(); // Close modal after submission
    } catch (error) {
      console.error("Error adding book:", error.message);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: "20px", marginRight: "30px" }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Book
        </Button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Add New Book
          </Typography>

          <Box
            sx={{
              overflowY: "auto",
              flexGrow: 1,
              paddingRight: 2,
            }}
          >
            <Typography variant="body1">Cover Image</Typography>
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
                  {coverImage ? coverImage.name : "Drag And Drop or Choose File"}
                </Typography>
              </label>
            </Box>

            <TextField
              fullWidth
              label="Book Title"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Author"
              margin="normal"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <TextField
              fullWidth
              label="Genre"
              margin="normal"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <TextField
              fullWidth
              label="ISBN"
              margin="normal"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <TextField
              fullWidth
              label="Published Year"
              margin="normal"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              select
            >
              {[2023, 2022, 2021, 2020].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Publisher"
              margin="normal"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Total Copies"
              margin="normal"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              type="number"
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ marginTop: 2 }}
          >
            Add Book
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddBookForm;
