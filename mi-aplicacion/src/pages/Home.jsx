import NuevoDesktopNavbar from '../components/navbar/NuevoDesktopNavbar';
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