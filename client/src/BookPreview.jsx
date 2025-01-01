import React from "react";
import Navbar from "./components/Navbar";
import coverImg from "./assets/song_of_ice.jpg";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "./components/Footer/Footer";


// Styled Material-UI components for search bar
const Search = styled(Box)(() => ({
  borderRadius: "2rem",
  border: "2px solid rgb(12, 57, 155)",
  backgroundColor: "#fff",
  boxShadow: "0px 2px 4px rgba(20, 101, 194, 0.1)",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  width: "20rem",
  height: "2rem",
}));

const SearchIconWrapper = styled(Box)(() => ({
  marginRight: "8px",
  color: "rgb(12, 57, 155)",
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: "#7f7f7f",
  fontSize: "0.9rem",
  flex: 1,
  "& .MuiInputBase-input": {
    width: "100%",
    height: "100%",
    padding: 0,
  },
}));

function BookPreview() {
  return (
    <>
      <Navbar />

      {/* Search bar container */}
      <Box className="search-bar-container">
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search by book name, Author, Subject"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>

      {/* Book preview content */}
      <Box className="book-preview-page">
        <Box className="book-preview-container">
          <Box>
            <img
              src={coverImg}
              alt="A Song of Ice and Fire"
              className="book-preview-image"
            />
          </Box>
          <Box className="book-preview-details">
            <h1>A Song of Ice and Fire</h1>
            <p className="author">
              By <span className="author-name">George R.R. Martin</span>
            </p>
            <Box className="info">
              <p>
                <strong>Genre:</strong> High Fantasy
              </p>
              <p>
                <strong>Publisher:</strong> Bantam Books
              </p>
              <p>
                <strong>Published Year:</strong> 01/08/1996
              </p>
              <p>
                <strong>ISBN:</strong> 9874123658
              </p>
              <Box className="reserve-container">
                <label htmlFor="branch">
                  <strong>Branch:</strong>
                </label>
                <select id="branch" className="branch-select">
                  <option value="main">Main Branch</option>
                  <option value="downtown">Downtown</option>
                </select>
                <button className="reserve-button">Reserve</button>
              </Box>
              <p>
                <strong>Available Copies:</strong>{" "}
                <span className="available-copies">6</span>
              </p>
            </Box>
            <Box className="book-preview-description">
              <h2>Description:</h2>
              <p>
                A nulla fusce lectus enim sapien amet. Faucibus elit nibh vel
                sapien est ornare. Nulla est mauris libero nulla mi ultricies
                amet ridiculus ut. Sit netus libero pretium amet ultrices neque
                vel. Arcu turpis at faucibus pellentesque quam malesuada nunc.
                At interdum purus pharetra nec. Vestibulum eu id enim egestas
                volutpat sapien aliquam dignissim. Ipsum at facilisi enim
                dignissim.
              </p>
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}

export default BookPreview;
