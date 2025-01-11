import React from 'react';
import Navbar from "./components/Navbar";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider'; 
import Footer from './components/Footer/Footer';

import image1 from './assets/image1.png'; 
import image2 from './assets/image2.png'; 
import image3 from './assets/image3.png'; 
import image4 from './assets/image4.png'; 
import image5 from './assets/image5.png'; 
import image6 from './assets/image6.png'; 
import image7 from './assets/image7.png'; 
import image8 from './assets/image8.png'; 


const books = [
  {
    id: 1,
    title: "Don't Make Me Think",
    author: "Steve Krug",
    year: 2000,
    image: image1, 
    reservedOn: "11 Mar 2023",
    reservationExpireOn: "14 Mar 2023",
  },
  {
    id: 2,
    title: "Design Of Everyday Things",
    author: "Andy Hunt, Dave Thomas",
    year: 1999,
    image: image2,
    reservedOn: "12 Mar 2023",
    reservationExpireOn: "16 Mar 2023",
  },
  {
    id: 3,
    title: "Sprint",
    author: "Robert C. Martin",
    year: 2008,
    image: image3, 
    reservedOn: "10 Mar 2023",
    reservationExpireOn: "15 Mar 2023",
  },
  {
    id: 4,
    title: "Lean UX",
    author: "Martin Fowler",
    year: 2018,
    image: image4, 
    reservedOn: "13 Mar 2023",
    reservationExpireOn: "18 Mar 2023",
  },
];

// array for Borrowed Books
const borrowedBooks = [
  {
    id: 1,
    title: "Design of Everyday Things",
    author: "Don Norman",
    year: 1988,
    image: image5,
    borrowedOn: "1 Dec 2023",
    dueDate: "15 Dec 2023",
  },
  {
    id: 2,
    title: "The Lean Startup",
    author: "Eric Ries",
    year: 2011,
    image: image6,
    borrowedOn: "5 Dec 2023",
    dueDate: "19 Dec 2023",
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    image: image7,
    borrowedOn: "7 Dec 2023",
    dueDate: "21 Dec 2023",
  },
  {
    id: 4,
    title: "Deep Work",
    author: "Cal Newport",
    year: 2016,
    image: image8,
    borrowedOn: "9 Dec 2023",
    dueDate: "23 Dec 2023",
  },
];

function MyShelf() {
  return (
    <>
      <Navbar />
      <div>
        {/* My Shelf */}
        <Typography 
          variant="h1" 
          component="div" 
          sx={{ 
            marginTop: '40px',
            fontSize: {
              xs: '1.2rem', 
              sm: '2rem', 
              md: '2.5rem', 
              lg: '3rem', 
            },
            textAlign: 'left', 
            fontFamily: 'poppins', 
            marginX: '80px', 
          }}
        >
          <span style={{ color: 'black' }}>My</span>{' '}
          <span style={{ color: '#0056b3' }}>Shelf</span>
        </Typography>

        {/* Your Reserved Books */}
        <Typography
          variant="h2"
          component="div"
          sx={{ 
            marginTop: '40px',
            fontSize: {
              xs: '0.6rem', 
              sm: '1rem', 
              md: '1.4rem', 
              lg: '1.8rem', 
            },
            textAlign: 'left', 
            fontFamily: 'poppins', 
            marginX: '80px',  
            cursor: 'pointer',
            '&:hover': {
              color: '#0056b3', 
            }
          }}
        >
          Your Reserved Books
        </Typography>

        {/* Reserved Cards */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            marginTop: '20px', 
            paddingLeft: '60px', 
            paddingRight: '60px',  
            justifyContent: 'center',  
            maxWidth: '100%',  
            margin: '0 auto' 
          }} 
        >
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.id}>
              <Card sx={{ maxWidth: '80%', marginTop: '30px', margin: '20px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={book.image}
                    alt={book.title}
                    sx={{ objectFit: 'contain' }} 
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {book.author}, {book.year}
                    </Typography>
                    <Divider sx={{ marginY: '12px' }} />

                    {/* Reserved on and Due Date */}
                    <Typography variant="body2" sx={{ marginTop: '15px', fontWeight: 'bold' }}>
                      Reserved on
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px', color: 'text.secondary' }}>
                      {book.reservedOn}
                    </Typography>

                    <Typography variant="body2" sx={{ marginTop: '15px', fontWeight: 'bold' }}>
                      Reservation expire on
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px', color: 'text.secondary' }}>
                      {book.reservationExpireOn}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #ddd', 
                    marginBottom: '20px' 
                  }}
                >
                  <Button 
                    size="small" 
                    color="primary" 
                    sx={{
                        marginTop: '15px', 
                        border: '1px solid #0056b3', 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        '&:hover': {
                        backgroundColor: '#0056b3', 
                        color: 'white', 
                      }
                    }}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/*  Your Borrowed Books */}
        <Typography
          variant="h2"
          component="div"
          sx={{ 
            marginTop: '50px',
            fontSize: {
              xs: '0.6rem', 
              sm: '1rem', 
              md: '1.4rem', 
              lg: '1.8rem', 
            },
            textAlign: 'left', 
            fontFamily: 'poppins', 
            marginX: '80px',  
            cursor: 'pointer',
            '&:hover': {
              color: '#0056b3', 
            }
          }}
        >
          Your Borrowed Books
        </Typography>

        {/* Borrowed Cards */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            marginTop: '20px', 
            paddingLeft: '60px', 
            paddingRight: '60px', 
            justifyContent: 'center', 
            maxWidth: '100%', 
            margin: '0 auto' 
          }} 
        >
          {borrowedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.id}>
              <Card sx={{ maxWidth: '80%', marginTop: '30px', margin: '20px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={book.image}
                    alt={book.title}
                    sx={{ objectFit: 'contain' }} 
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {book.author}, {book.year}
                    </Typography>
                    <Divider sx={{ marginY: '12px' }} />

                    {/* Borrowed on and Due Date */}
                    <Typography variant="body2" sx={{ marginTop: '15px', fontWeight: 'bold' }}>
                      Borrowed on
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px', color: 'text.secondary' }}>
                      {book.borrowedOn}
                    </Typography>

                    <Typography variant="body2" sx={{ marginTop: '15px', fontWeight: 'bold' , color: 'red' }}>
                      Due Date
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px', color: 'red' }}>
                      {book.dueDate}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                
              </Card>
            </Grid>
          ))}
        </Grid>

        <Footer />
      </div>
    </>
  );
}

export default MyShelf;
