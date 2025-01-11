import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import TotalCard from "../components/TotalCard";
import SearchBar from "../components/SearchBar";
import ReservationsTable from "../components/LibrarianComponents/ReservationsTable";
import axios from "axios"; // Add axios for API calls

const ReservationsManage = () => {
  const [reservations, setReservations] = useState([]);
  const [librarianName, setLibrarianName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reservationsColumns = [
    { field: "bookTitle", title: "Book Title" },
    { field: "copyNumber", title: "Copy Number" },
    { field: "userName", title: "Patron Name" },
    { field: "reservedAt", title: "Reserved At" },
    { field: "status", title: "Status" },
  ];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
  
        const reservationsResponse = await axios.get(
          "http://localhost:5000/api/reservations/branch",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const transformedReservations = reservationsResponse.data.reservations
          .filter((reservation) => reservation.status !== "borrowed") // Exclude borrowed reservations
          .map((reservation) => {
            return {
              ...reservation,
              bookTitle: reservation.book?.title || "Unknown Book",  // Use book title from backend response
              copyNumber: reservation.book?.copyNumber || "Unknown Copy",  // Use copy number from backend response
              userName: reservation.userId?.fullName || "Unknown Patron",
              userEmail: reservation.userId?.email || "No Email Provided",
            };
          });
  
        setReservations(transformedReservations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Unable to fetch reservations. Please try again.");
        setLoading(false);
      }
    };
  
    fetchReservations();
  }, []);
  
  useEffect(() => {
    const storedLibrarianName = localStorage.getItem("librarianName") || "Jana";
    setLibrarianName(storedLibrarianName);
  }, []);

  const handleMarkAsBorrowed = async (reservation) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/reservations/${reservation._id}/borrow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove the reservation from the state
      setReservations((prevReservations) =>
        prevReservations.filter((res) => res._id !== reservation._id)
      );

      console.log("Reservation marked as borrowed.");
    } catch (error) {
      console.error("Error marking reservation as borrowed:", error);
    }
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
    // Add search filtering logic here
  };

  return (
    <>
      <AdminNavbar />
      <Box sx={{ padding: "40px" }}>
        <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}>
          Hello {librarianName},
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: 4, marginLeft: 1 }}>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Active Reservations" value={reservations.length} color="#34A853" />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ marginTop: 6, marginBottom: 8 }}>
          <Grid item>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                marginBottom: 0,
                fontSize: 28,
              }}
            >
              Reservations Manage
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <SearchBar onSearch={handleSearch} />
          </Grid>
        </Grid>
        {loading ? (
          <Typography>Loading reservations...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <ReservationsTable data={reservations} columns={reservationsColumns} onMarkAsBorrowed={handleMarkAsBorrowed} />
        )}
      </Box>
    </>
  );
};

export default ReservationsManage
