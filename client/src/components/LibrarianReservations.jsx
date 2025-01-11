import React, { useEffect, useState } from "react";
import { fetchActiveReservations, markAsBorrowed } from "../services/api";

const LibrarianReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveReservations();
        // Filter reservations to show only active ones
        const activeReservations = data.filter((res) => res.status === "active");
        setReservations(activeReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleMarkAsBorrowed = async (reservationId) => {
    try {
      await markAsBorrowed(reservationId);
      alert("Marked as borrowed successfully!");

      // Update reservations after marking as borrowed
      setReservations((prev) => prev.filter((res) => res._id !== reservationId));
    } catch (error) {
      console.error("Error marking as borrowed:", error.message);
      alert("Failed to mark as borrowed.");
    }
  };

  return (
    <div>
      <h1>Librarian Panel - Active Reservations</h1>
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length > 0 ? (
        <ul>
  {reservations.map((res) => (
    <li key={res._id}>
      <strong>Reservation ID:</strong> {res._id} <br />
      <strong>User:</strong> {res.userId?.fullName || "N/A"} <br />
      <strong>Book Copy ID:</strong> {res.bookCopyId?._id || "N/A"} <br />
      <strong>Reserved At:</strong> {new Date(res.reservedAt).toLocaleString()} <br />
      <button onClick={() => handleMarkAsBorrowed(res._id)}>Mark as Borrowed</button>
    </li>
  ))}
</ul>

      ) : (
        <p>No active reservations found.</p>
      )}
    </div>
  );
};

export default LibrarianReservations;
