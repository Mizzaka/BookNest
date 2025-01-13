import React, { useState } from "react";
import axios from "axios";
import Background from '../assets/Rectangle.png'

import {
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Form({ setAuthToken, setRole }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { accessToken, user } = response.data;
      const { role } = user;

      setAuthToken(accessToken);
      setRole(role);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role);

      

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "librarian") {
        navigate("/bookmanage");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to log in.");
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "poppins",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "98.5vh",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        padding: 0,
        overflowX: "hidden",
        cursor: "pointer",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: "350px",
          width: "100%",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <img
          src="src/assets/logoo.png"
          alt="Logo"
          style={{
            width: "35%",
            height: "auto",
            display: "block",
            margin: '0 auto',
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{ 
            textAlign: "center",
            fontWeight: "bold",
            color: "#0653B8",
            fontSize: "larger",
            fontFamily: "inter",
          }}
        >
          Welcome back!
          <p
            style={{
              color: "rgba(171, 171, 171, 1)",
              fontSize: "0.9rem",
              justifyContent: "center",
              fontFamily: "inter",
              alignItems: "center",
              marginBottom: "10px",
              marginTop: "5px"
            }}
          >
            Sign in to continue to your Digital Library
          </p>
        </Typography>

        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={formData.email}
          onChange={handleInputChange}
          sx={{ marginBottom: "16px" }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={formData.password}
          onChange={handleInputChange}
          sx={{ marginBottom: "16px" }}
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Remember Me"
          sx={{  }}
        />
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "small",
            width: '100%',
            marginBottom: "10px"
          }}
        >
          Forgot password ?
        </a>
        {error && (
          <Typography
            color="error"
            sx={{
              fontSize: "small",
              marginBottom: "10px",
            }}
          >
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0653B8",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(15, 56, 161, 1)",
            },
            fullWidth: true,
          }}
          type="submit"
        >
          Login
        </Button>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "small",
            textAlign: "center",
          }}
        >
          New User?{" "}
          <a href="/register" target="_blank" rel="noopener noreferrer">
            Register Here
          </a>
        </Typography>
      </Box>
    </Box>
  );
}

export default Form;
