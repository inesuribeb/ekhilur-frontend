import { Outlet } from "react-router-dom";
import "./Root.css";
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"

function Root() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}

export default Root;