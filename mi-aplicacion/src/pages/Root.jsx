import { Outlet } from "react-router-dom";
import "./Root.css";
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import MobileNavbar from "../components/navbar/MobileNavbar";
import DesktopNavbar from "../components/navbar/DesktopNavbar";

function Root() {
    return (
        <>
            <DesktopNavbar />
             <Header />
            <Outlet />
            <Footer />
            <MobileNavbar />
        </>
    );
}

export default Root;