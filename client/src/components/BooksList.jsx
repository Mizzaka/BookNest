import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/api";

const BooksList = ({ onBookSelect }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };
    getBooks();
  }, []);

  return (
    <div>
      <h1>Books List</h1>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <button onClick={() => onBookSelect(book._id)}>View Details</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading books...</p>
      )}
    </div>
  );
};

export default BooksList;
