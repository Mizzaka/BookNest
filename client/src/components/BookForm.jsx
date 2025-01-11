import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const BookForm = ({ onClose, onSubmit }) => {

const [title, setTitle] = useState("");
const [author, setAuthor] = useState("");
const [genre, setGenre] = useState("");
const [isbn, setIsbn] = useState("");
const [publishedYear, setPublishedYear] = useState("");
const [publisher, setPublisher] = useState("");
const [description, setDescription] = useState("");

  const [branches, setBranches] = useState([{ branchName: "", quantity: "" }]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    publishedYear: "",
    publisher: "",
    description: "",
  });
  const [coverImage, setCoverImage] = useState(null);

  const handleBranchChange = (index, field, value) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };

  const addBranch = () => {
    setBranches([...branches, { branchName: "", quantity: "" }]);
  };

  const removeBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    console.log("Form submitted");
    const formData = new FormData();
  
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("isbn", isbn);
    formData.append("publishedYear", publishedYear);
    formData.append("publisher", publisher);
    formData.append("description", description);
  
    formData.append("branchData", JSON.stringify(branches));
    if (coverImage) formData.append("coverImage", coverImage);
  
    try {
      await onSubmit(formData); // Pass formData to parent handler
      alert("Book added successfully!");
    } catch (error) {
      console.error("Error submitting book form:", error.message);
    }
  };
  
  

  return (
    <Box sx={{ padding: "16px" }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Add New Book
      </Typography>

       {/* Cover Image */}
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

     

      {/* Branch and Quantity */}
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Branches
      </Typography>
      {branches.map((branch, index) => (
        <Box key={index} sx={{ display: "flex", gap: "10px", marginBottom: 2 }}>
          <TextField
            label="Branch Name"
            value={branch.branchName}
            onChange={(e) =>
              handleBranchChange(index, "branchName", e.target.value)
            }
            fullWidth
          />
          <TextField
            label="Quantity"
            value={branch.quantity}
            onChange={(e) =>
              handleBranchChange(index, "quantity", e.target.value)
            }
            type="number"
            fullWidth
          />
          <IconButton
            color="error"
            onClick={() => removeBranch(index)}
            disabled={branches.length === 1}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={addBranch}
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        Add Branch
      </Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Add Book
      </Button>
    </Box>
  );
};

export default BookForm;
