import React from 'react';
import BasicNavbar from '../components/navbar/DesktopNavbar';
import LoginForm from '../components/auth/Login';
import './Home.css';


const Home = () => {
  return (
    <div className="home-page">
      <BasicNavbar />
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;