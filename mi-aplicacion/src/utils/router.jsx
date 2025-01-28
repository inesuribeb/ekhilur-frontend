import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Maps from "../pages/maps/Maps"
import Transactions from "../pages/transactions/Transactions"
import Graphics from "../pages/graphics/Graphics"
import Menu from "../components/menu/Menu";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "menu",
                element: <Menu />,
            },
            {
                path: "mapak",
                element: <Maps />,
            },
            {
                path: "transakzioak",
                element: <Transactions />,
            },
            {
                path: "grafikak",
                element: <Graphics />,
            },
            
        ],
    },
]);
export default router;