import React from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

// images 
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';
import image7 from '../assets/image7.png';
import image8 from '../assets/image8.png';
import image9 from '../assets/image9.png';
import image10 from '../assets/image10.png';
import image11 from '../assets/image11.png';
import image12 from '../assets/image12.png';
import image13 from '../assets/image13.png';
import image14 from '../assets/image14.png';

// Search bar styles
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '2rem',
  border: '2px solid rgb(12, 57, 155)',
  backgroundColor: '#fff',
  boxShadow: '0px 2px 4px rgba(20, 101, 194, 0.1)',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  width: '20rem',
  height: '2rem',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: 'rgb(12, 57, 155)',
  display: 'flex',
  alignItems: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#7f7f7f',
  fontSize: '0.9rem',
  flex: 1,
  '& .MuiInputBase-input': {
    width: '100%',
    height: '100%',
    padding: 0,
  },
}));

function MainHome() {
  const cardData = [
    { title: 'Don’t Make Me Think', description: 'Steve Krug, 2000.', image: image1, ratingLeft: '4.5', ratingRight: '/5' },
    { title: 'The Design of Everyday Things', description: 'Don Norman, 1988.', image: image2, ratingLeft: '5', ratingRight: '/5' },
    { title: 'Sprint: How to Solve Big Problems', description: 'Jake Knapp, 2000.', image: image3, ratingLeft: '4', ratingRight: '/5' },
    { title: 'Learn UX : Design Great Product', description: 'Steve Krug, 2000.', image: image4, ratingLeft: '4.5', ratingRight: '/5' },
    { title: 'Rich Dad Poor Dad', description: 'Robert T.Kiyosaki, 1997.', image: image5, ratingLeft: '5', ratingRight: '/5' },
    { title: 'The Road to React', description: 'Steve Krug, 2000.', image: image6, ratingLeft: '3.5', ratingRight: '/5' },
    { title: 'Harry Potter and The Philosopher’s Stone', description: 'J.K. Rowling, 2002.', image: image7, ratingLeft: '5', ratingRight: '/5' },
  ];

  const additionalCardData = [
    { title: 'Madolduwa', description: 'Steve Krug, 2000.', image: image8, ratingLeft: '4.5', ratingRight: '/5' },
    { title: 'Gamperaliya', description: 'Don Norman, 1988.', image: image9, ratingLeft: '4.7', ratingRight: '/5' },
    { title: 'Yuganthaya', description: 'Jake Knapp, 2000.', image: image10, ratingLeft: '4.6', ratingRight: '/5' },
    { title: 'Sinhala sahithya', description: 'Jeff Gothelf, 2016.', image: image11, ratingLeft: '4.9', ratingRight: '/5' },
    { title: 'Eya', description: 'Steve Krug, 2000.', image: image12, ratingLeft: '4.8', ratingRight: '/5' },
    { title: 'Anthathsara', description: 'Robert T.Kiyosaki, 1997.', image: image13, ratingLeft: '4.5', ratingRight: '/5' },
    { title: 'Sangutha wicharaya', description: 'J.K. Rowling, 2002.', image: image14, ratingLeft: '4.5', ratingRight: '/5' },

  ];

  return (
    <>
      <div className="head-items">
        <h1>Good Morning</h1>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search by book name, Author, Subject" inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <style>
          {`
            .head-items {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 10vh;
              font-size: 5rem;
              max-width: 1680px;
              margin: 1rem auto;
              padding: 0 2rem;
            }

            h1 {
              margin: 0;
              font-size: 2rem;
              font-weight: bold;
              color: #333;
              margin-left: -20px
            }
          `}
        </style>
      </div>

      <div className="card-one">
        <h2 className="card-h2">New Arrivals</h2>
        <a className="show-btn" href="/showall">
          show all
        </a>

        <style>
          {`
            .card-one {
              max-width: 1680px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 1rem auto;
              padding: 0 1rem;
              gap: 1rem;
              flex-wrap: wrap;
            }

            .card-h2 {
              font-size: 1.5rem;
              font-family: 'Poppins', sans-serif;
              font-weight: normal;
              margin: 0;
              flex-shrink: 0;
            }

            .show-btn {
              padding: 0.5rem 1rem;
              text-decoration: none;
              font-family: 'Poppins', sans-serif;
              font-size: 1rem;
              flex-shrink: 0;
            }

            @media (max-width: 768px) {
              .card-one {
                flex-direction: column;
                align-items: flex-start;
              }

              .card-h2, .show-btn {
                margin-bottom: 0.5rem;
              }
            }
          `}
        </style>
      </div>

      {/* Cards Section */}
      <Grid container spacing={2} style={{ maxWidth: '1680px', margin: '1rem auto' }}>
        {cardData.map((card, index) => (
          <Grid item xs={6} sm={4} md={3} lg={1.714} key={index}>
            <Card
              style={{
                height: '100%',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              className="card"
            >
              <CardMedia
                component="img"
                style={{
                  height: '180px',
                  width: 'auto',
                  margin: '0 auto',
                  paddingTop: '10px',
                }}
                image={card.image}
                alt={`Cover of ${card.title}`}
              />
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  style={{ fontWeight: 'bold', marginBottom: '10px' }}
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <div style={{ textAlign: 'left', padding: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{card.ratingLeft}</span>
                <span style={{ fontWeight: 'normal' }}>{card.ratingRight}</span>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Cards Section */}
      <div className="card-two">
        <h2 className="card-h2-2">Popular Books</h2>
        <a className="show-btn" href="/showall">
          show all
        </a>
        <style>
        {`
          .card-two {
              max-width: 1680px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 1rem auto;
              padding: 0 1rem;
              gap: 1rem;
              flex-wrap: wrap;
              margin-top: 5rem;
          }

          .card-h2-2 {
            font-size: 1.5rem;
            font-family: 'Poppins';
            font-weight: normal;
            }



            
          .card:hover {
            transform: scale(1.05);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      </div>

      <Grid container spacing={2} style={{ maxWidth: '1680px', margin: '1rem auto' }}>
        {additionalCardData.map((card, index) => (
          <Grid item xs={6} sm={4} md={3} lg={1.714} key={index}>
            <Card
              style={{
                height: '100%',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              className="card"
            >
              <CardMedia
                component="img"
                style={{
                  height: '180px',
                  width: 'auto',
                  margin: '0 auto',
                  paddingTop: '10px',
                }}
                image={card.image}
                alt={`Cover of ${card.title}`}
              />
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  style={{ fontWeight: 'bold', marginBottom: '10px' }}
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <div style={{ textAlign: 'left', padding: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{card.ratingLeft}</span>
                <span style={{ fontWeight: 'normal' }}>{card.ratingRight}</span>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      
    </>
  );
}

export default MainHome;
