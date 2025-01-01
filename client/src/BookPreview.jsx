import React from "react";
import Navbar from "./components/Navbar";
import coverImg from "./assets/song_of_ice.jpg";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "./components/Footer/Footer";
import { Typography, Select, MenuItem, Button,  } from "@mui/material";

// Styled Material-UI components
const Search = styled(Box)({
  borderRadius: "2rem",
  border: "2px solid rgb(12, 57, 155)",
  backgroundColor: "#fff",
  boxShadow: "0px 2px 4px rgba(20, 101, 194, 0.1)",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  width: "20rem",
  height: "2rem",
});

const SearchIconWrapper = styled(Box)({
  marginRight: "8px",
  color: "rgb(12, 57, 155)",
  display: "flex",
  alignItems: "center",
});

const StyledInputBase = styled(InputBase)({
  color: "#7f7f7f",
  fontSize: "0.9rem",
  flex: 1,
  "& .MuiInputBase-input": {
    width: "100%",
    height: "100%",
    padding: 0,
  },
});

function BookPreview() {
  return (
    <>
      <Navbar />

      {/* Search bar container */}
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "50px",
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1800px",
        }}
      >
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
      <Box
        sx={{
          minHeight: "100vh",
          padding: "50px 20px",
          paddingTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "40px",
            maxWidth: "1300px",
            width: "100%",
            backgroundColor: "#fff",
            padding: "40px",
          }}
        >
          <Box>
            <img
              src={coverImg}
              alt="A Song of Ice and Fire"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "5px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h1" sx={{ fontSize: "3rem", color: "#333", marginBottom: "10px" }}>
              A Song of Ice and Fire
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.2rem", color: "#555", marginBottom: "20px" }}
            >
              By <span style={{ color: "#0066cc", textDecoration: "underline" }}>George R.R. Martin</span>
            </Typography>
            <Box sx={{ fontSize: "1.2rem", color: "#555", lineHeight: 2, marginBottom: "20px" }}>
              <Typography>
                <strong>Genre:</strong> High Fantasy
              </Typography>
              <Typography>
                <strong>Publisher:</strong> Bantam Books
              </Typography>
              <Typography>
                <strong>Published Year:</strong> 01/08/1996
              </Typography>
              <Typography>
                <strong>ISBN:</strong> 9874123658
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "10px 0",
                  marginTop: "30px",
                }}
              >
                <label htmlFor="branch">
                  <strong>Branch:</strong>
                </label>
                <Select
                  id="branch"
                  defaultValue="main"
                  sx={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  <MenuItem value="main">Main Branch</MenuItem>
                  <MenuItem value="downtown">Downtown</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  sx={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    "&:hover": {
                      backgroundColor: "#0056b3",
                    },
                  }}
                >
                  Reserve
                </Button>
              </Box>
              <Typography>
                <strong>Available Copies:</strong>{" "}
                <span style={{ fontWeight: "bold", color: "#28a745" }}>6</span>
              </Typography>
            </Box>
            <Box sx={{ marginTop: "30px", fontSize: "1rem", lineHeight: 1.8, color: "#444" }}>
              <Typography variant="h2" sx={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                Description:
              </Typography>
              <Typography>
                A nulla fusce lectus enim sapien amet. Faucibus elit nibh vel sapien est ornare.
                Nulla est mauris libero nulla mi ultricies amet ridiculus ut. Sit netus libero
                pretium amet ultrices neque vel. Arcu turpis at faucibus pellentesque quam malesuada
                nunc. At interdum purus pharetra nec. Vestibulum eu id enim egestas volutpat sapien
                aliquam dignissim. Ipsum at facilisi enim dignissim.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}

export default BookPreview;
