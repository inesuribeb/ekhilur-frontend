import HeatMap from "../../components/graphics-transactions/MapTest";
import HeatMap2 from "../../components/graphics-transactions/MapTest2";
import BubbleMap from "../../components/graphics-transactions/MapTest3";
import ClusterMap from "../../components/graphics-transactions/MapTest4";
import RippleMap from "../../components/graphics-transactions/MapTest5";
import IsolineMap from "../../components/graphics-transactions/MapTest6";
import RadialGradientMap from "../../components/graphics-transactions/MapTest8";
import HeatSymbolMap from "../../components/graphics-transactions/MapTestt9";
import './Transactions.css'

function Transactions() {
    return (
        <div className="transactions-test-map">
            <HeatMap></HeatMap>
            <HeatMap2></HeatMap2>
            <BubbleMap></BubbleMap>
            <ClusterMap></ClusterMap>
            <RippleMap></RippleMap>
            <IsolineMap></IsolineMap>
            <RadialGradientMap></RadialGradientMap>
            <HeatSymbolMap></HeatSymbolMap>


        </div>
    )
}

export default Transactions;