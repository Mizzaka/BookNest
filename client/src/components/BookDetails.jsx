import React, { useEffect, useState } from "react";
import { fetchBookDetails, createReservation } from "../services/api";

const BookDetails = ({ bookId }) => {
  const [book, setBook] = useState(null);
  const [userId, setUserId] = useState(""); // Manual User ID input

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const data = await fetchBookDetails(bookId);
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error.message);
      }
    };
    getBookDetails();
  }, [bookId]);

  const handleReserve = async (copyId) => {
    try {
      await createReservation({
        userId, // Input manually for now
        bookCopyId: copyId,
      });
      alert("Book reserved successfully!");
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      alert("Failed to reserve the book.");
    }
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>ISBN: {book.isbn}</p>
      <h3>Available Copies</h3>
      <ul>
        {book.bookCopies.map((copy) =>
          copy.status === "available" ? (
            <li key={copy._id}>
              <p>Copy Number: {copy.copyNumber}</p>
              <p>Branch: {copy.branch}</p>
              <button onClick={() => handleReserve(copy._id)}>Reserve</button>
            </li>
          ) : null
        )}
      </ul>
      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
        />
      </div>
    </div>
  );
};

export default BookDetails;
