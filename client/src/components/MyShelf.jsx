import React, { useEffect, useState } from "react";
import axios from "axios";

const MyShelf = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Fetch reservations for the specific user
        const response = await axios.get(`http://localhost:5000/api/reservations?userId=${userId}`);
        setReservations(response.data);

        // Split reservations into Active and Borrowed
        const active = response.data.filter((res) => res.status === "active");
        const borrowed = response.data.filter((res) => res.status === "borrowed");

        setActiveReservations(active);
        setBorrowedBooks(borrowed);
      } catch (error) {
        console.error("Error fetching reservations:", error.message);
      }
    };

    fetchReservations();
  }, [userId]);

  return (
    <div>
      <h1>My Shelf</h1>

      {/* Active Reservations Section */}
      <section>
        <h2>Active Reservations</h2>
        {activeReservations.length > 0 ? (
          <ul>
            {activeReservations.map((res) => (
              <li key={res._id}>
                <strong>Book Copy ID:</strong> {res.bookCopyId?._id || "N/A"} <br />
                <strong>Reserved At:</strong> {new Date(res.reservedAt).toLocaleString()} <br />
                <strong>Expires On:</strong> {new Date(res.expiryDate).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No active reservations.</p>
        )}
      </section>

      {/* Borrowed Books Section */}
      <section>
        <h2>Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <ul>
            {borrowedBooks.map((res) => (
              <li key={res._id}>
                <strong>Book Copy ID:</strong> {res.bookCopyId?._id || "N/A"} <br />
                <strong>Borrowed At:</strong> {new Date(res.reservedAt).toLocaleString()} <br />
                <strong>Due Date:</strong> {new Date(res.expiryDate).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No borrowed books.</p>
        )}
      </section>
    </div>
  );
};

export default MyShelf;
