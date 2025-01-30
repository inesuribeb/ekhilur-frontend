<<<<<<< HEAD
import BasicNavbar from '../components/navbar/DesktopNavbar';
=======
import React from 'react';
import NuevoDesktopNavbar from '../components/navbar/NuevoDesktopNavbar';
>>>>>>> 7da099182bd3a106cf845d8ab809aa4f6e6a2d1e
import LoginForm from '../components/auth/Login';
import './Home.css';


const Home = () => {
  return (
    <div className="home-page">
      <NuevoDesktopNavbar/>
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;