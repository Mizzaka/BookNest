import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import axios from 'axios';
import logoImg from '../assets/logoo.png'
import background from '../assets/Rectangle.png';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/users', formData);
      setSuccessMessage('Registration successful! Please log in.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '98.5vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: 0,
        overflowX: 'hidden',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: '350px',
          width: '100%',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <img
          src={logoImg}
          alt="Logo"
          style={{
            marginLeft: '115px',
            width: '35%',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#0653B8',
            fontSize: 'larger',
            fontFamily: 'Inter',
          }}
        >
          Welcome back!
          <p style={{ color: 'rgba(171, 171, 171, 1)', fontSize: 'small' }}>
            Register Here
          </p>
        </Typography>
        <TextField
          label="Full Name"
          name="fullName"
          type="text"
          variant="outlined"
          fullWidth
          required
          value={formData.fullName}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          type="text"
          variant="outlined"
          fullWidth
          required
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Remember Me"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            backgroundColor: '#0653B8',
            color: 'white',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(15, 56, 161, 1)',
            },
          }}
        >
          Register
        </Button>
        {errorMessage && (
          <Typography color="error" sx={{ textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" sx={{ textAlign: 'center' }}>
            {successMessage}
          </Typography>
        )}
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: 'small',
            textAlign: 'center',
          }}
        >
          Login{' '}
          <a
            href="/login "
            style={{ textDecoration: 'none', color: '#0653B8' }}
          >
            Here
          </a>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
