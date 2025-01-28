const mockDataMap = {
    heatmapData: {
        coordinates: [
            [43.2682, -1.9757, 100], // Centro de Hernani
            [43.2675, -1.9745, 85],  // Kale Nagusia
            [43.2690, -1.9760, 75],  // Gudarien Etorbidea
            [43.2670, -1.9770, 65],  // Lizeaga Kalea
            [43.2685, -1.9740, 55],  // Kardaberaz Kalea
            [43.2695, -1.9755, 45],  // Elkano Kalea
            [43.2680, -1.9775, 35],  // Urbieta Kalea
            [43.2665, -1.9750, 25],  // Florida Auzoa
            [43.2673, -1.9765, 20],  // Zinkoenea Kalea
            [43.2688, -1.9748, 30]   // Izpizua Kalea
        ],
        config: {
            radius: 35,
            maxIntensity: 100,
            minIntensity: 0,
            blur: 15
        }
    },

    // Datos por barrio/zona
    regionData: [
        {
            region: "Centro",
            totalTransactions: 1500,
            avgAmount: 2500,
            coordinates: {
                lat: 43.2682,
                lng: -1.9757
            }
        },
        {
            region: "Kale Nagusia",
            totalTransactions: 1200,
            avgAmount: 2800,
            coordinates: {
                lat: 43.2675,
                lng: -1.9745
            }
        },
        {
            region: "Florida",
            totalTransactions: 800,
            avgAmount: 2300,
            coordinates: {
                lat: 43.2665,
                lng: -1.9750
            }
        }
    ]
};

export default mockDataMap;