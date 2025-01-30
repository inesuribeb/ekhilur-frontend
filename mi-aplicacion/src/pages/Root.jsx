import { Outlet } from "react-router-dom";
import "./Root.css";
import Header from "../components/header/Header"
<<<<<<< HEAD
import MobileNavbar from "../components/navbar/MobileNavbar";
import DesktopNavbar from "../components/navbar/DesktopNavbar";
=======
import Footer from "../components/footer/Footer"
import NuevoDesktopNavbar from "../components/navbar/NuevoDesktopNavbar";
>>>>>>> 7da099182bd3a106cf845d8ab809aa4f6e6a2d1e

function Root() {
    return (
        <>
<<<<<<< HEAD
            <DesktopNavbar />
             <Header />
            <Outlet />
            <MobileNavbar />
=======
           
            <Header />
            <main className="padding">
            <NuevoDesktopNavbar />
                <Outlet  /></main>
            <Footer />
           
>>>>>>> 7da099182bd3a106cf845d8ab809aa4f6e6a2d1e
        </>
    );
}

export default Root;