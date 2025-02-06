import { Outlet } from "react-router-dom";
import { useState } from "react";
import "./Root.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import NuevoDesktopNavbar from "../components/navbar/NuevoDesktopNavbar";

function Root() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    return (
        <>
            <Header />
            <main className="padding">
                <NuevoDesktopNavbar onRefresh={handleRefresh} />
                <Outlet key={refreshKey} />
            </main>
            <Footer />
        </>
    );
}

export default Root;