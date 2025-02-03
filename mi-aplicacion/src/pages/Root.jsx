import { Outlet } from "react-router-dom";
import "./Root.css";
import Header from "../components/header/Header"
import NuevoDesktopNavbar from "../components/navbar/NuevoDesktopNavbar";

function Root() {
    return (
        <>
            <Header />
            <main className="padding">
                <NuevoDesktopNavbar />
                <Outlet />
            </main>
        </>
    );
}

export default Root;