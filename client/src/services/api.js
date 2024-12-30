import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust backend URL if needed

// Fetch all books
export const fetchBooks = async () => {
  const response = await axios.get(`${API_BASE_URL}/books`);
  return response.data;
};

// Fetch book details by ID
export const fetchBookDetails = async (bookId) => {
  const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
  return response.data;
};

// Create a reservation
export const createReservation = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/reservations`, data);
  return response.data;
};

// Fetch active reservations
export const fetchActiveReservations = async () => {
  const response = await axios.get(`${API_BASE_URL}/reservations`);
  return response.data;
};

// Mark reservation as borrowed
export const markAsBorrowed = async (reservationId) => {
  const response = await axios.put(`${API_BASE_URL}/reservations/${reservationId}/borrow`);
  return response.data;
};