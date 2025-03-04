import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Transactions from "../pages/transactions/Transactions"
import RechartGraphics from "../pages/graphics/RechartGraphics"
import NuevoMenu from "../components/menu/NuevoMenu";
import Menu from "../components/menu/Menu";
import Clients from "../pages/client/Clients";
import MatrixGraph from "../components/graphics-transactions/Matrixgraph";

import MapHernaniTicket from "../components/map/MapHernaniTicket";

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
                element: <NuevoMenu />,
                
            },
            {
                path: "menu2",
                element: <Menu />,
            },
            {
                path: "bezeroak",
                element: <Clients />,
            },
        
            {
                path: "transakzioak",
                element: <Transactions />,
            },
        
            {
                path: "grafikak2",
                element: <RechartGraphics />,
            },
            {
                path: "aurreikuspenak",
                element: <RechartGraphics />,
            },
            {
                path: "matrix",
                element: <MatrixGraph />,
            },
           /*  {
                path: "hernani",
                element: <MapHernaniClient />,
            }, */
            {
                path: "ticket",
                element: <MapHernaniTicket />,
            },
            
        ],
    },
]);
export default router;