import React from "react";
import Navbar from "./components/Navbar";
import MainHome from "./components/MainHome";
import Footer from "./components/Footer/Footer";
import SocketTest from "./components/SocketTest";

const Home = () => {
  

  return (
    <> 
    <SocketTest />
      <Navbar />
      <MainHome />
      <Footer />
    </>
  );
};

export default Home;
