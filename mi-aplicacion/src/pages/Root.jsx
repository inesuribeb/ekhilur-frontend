import { Outlet } from "react-router-dom";
import "./Root.css";
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import NuevoDesktopNavbar from "../components/navbar/NuevoDesktopNavbar";

function Root() {
    return (
        <>
           
            <Header />
            <main className="padding">
            <NuevoDesktopNavbar />
                <Outlet  /></main>
            <Footer />
           
        </>
    );
}

export default Root;