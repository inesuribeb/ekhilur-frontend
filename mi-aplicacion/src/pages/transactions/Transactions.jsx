import HeatMap from "../../components/graphics-transactions/MapTest";
import HeatMap2 from "../../components/graphics-transactions/MapTest2";
import BubbleMap from "../../components/graphics-transactions/MapTest3";
import ClusterMap from "../../components/graphics-transactions/MapTest4";
import './Transactions.css'

function Transactions() {
    return (
        <div className="transactions-test-map">
            <HeatMap></HeatMap>
            <HeatMap2></HeatMap2>
            <BubbleMap></BubbleMap>
            <ClusterMap></ClusterMap>
        </div>
    )
}

export default Transactions;