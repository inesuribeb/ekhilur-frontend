import Dashboard from "../../components/graphics-transactions/Graphics-Transactions";
// import HeatMap from "../../components/graphics-transactions/MapTest";
import './Graphics.css'

function Graphics () {
    return (
        <div className="graphics-container">
            <Dashboard></Dashboard>
            {/* <HeatMap></HeatMap> */}
        </div>
    )
}

export default Graphics;