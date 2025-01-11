import React, { useState } from "react";
import axios from "axios";

const BookAdding = ({ authToken }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    publishedYear: "",
    publisher: "",
    description: "",
  });
  const [branchData, setBranchData] = useState([{ branchName: "", quantity: "" }]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBranchData = [...branchData];
    updatedBranchData[index][name] = value;
    setBranchData(updatedBranchData);
  };

  const addBranchRow = () => {
    setBranchData([...branchData, { branchName: "", quantity: "" }]);
  };

  const removeBranchRow = (index) => {
    const updatedBranchData = branchData.filter((_, i) => i !== index);
    setBranchData(updatedBranchData);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("branchData", JSON.stringify(branchData)); // Add branch data as JSON
    if (image) data.append("coverImage", image);

    try {
      const response = await axios.post("http://localhost:5000/api/books", data, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token in headers
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Book added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating book:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to add book.");
    }
  };

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" name="author" value={formData.author} onChange={handleInputChange} />
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} />
        </div>
        <div>
          <label>ISBN:</label>
          <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} />
        </div>
        <div>
          <label>Published Year:</label>
          <input
            type="number"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Publisher:</label>
          <input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label>Cover Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <h3>Branch Data</h3>
        {branchData.map((branch, index) => (
          <div key={index}>
            <label>Branch Name:</label>
            <input
              type="text"
              name="branchName"
              value={branch.branchName}
              onChange={(e) => handleBranchChange(index, e)}
              required
            />
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={branch.quantity}
              onChange={(e) => handleBranchChange(index, e)}
              required
            />
            <button type="button" onClick={() => removeBranchRow(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addBranchRow}>
          Add Branch
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookAdding;
