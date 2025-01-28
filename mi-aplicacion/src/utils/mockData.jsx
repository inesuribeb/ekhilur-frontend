const mockData = {
    transactionsByOperation: {
        labels: ["Compra", "Venta", "Transferencia"],
        datasets: [
            {
                label: "Número de transacciones", 
                data: [120, 85, 150],
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"]
            }
        ]
    },
 
    transactionsOverTime: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
        datasets: [
            {
                label: "Volumen de transacciones",
                data: [5000, 7000, 6500, 8000, 9000],
                borderColor: "#42a5f5",
                fill: false
            }
        ]
    },
 
    userDistribution: {
        labels: ["Normal", "Premium", "VIP"],
        datasets: [
            {
                label: "Tipos de usuario",
                data: [300, 150, 50],
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"]
            }
        ]
    },
 
    transactionsByHour: {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
            label: "Transacciones por Hora",
            data: Array.from({length: 24}, () => Math.floor(Math.random() * 100)),
            backgroundColor: '#36a2eb'
        }]
    },
 
    userAgeDistribution: {
        labels: ["18-25", "26-35", "36-45", "46-55", "56+"],
        datasets: [{
            label: "Distribución por Edad",
            data: [45, 80, 65, 45, 20],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
    },
 
    transactionsByLocation: {
        labels: ["Centro", "Norte", "Sur", "Este", "Oeste"],
        datasets: [{
            label: "Transacciones por Ubicación",
            data: [250, 180, 200, 140, 160],
            backgroundColor: '#4bc0c0'
        }]
    },
 
    averageAmountByOperationType: {
        labels: ["Transferencias", "Pagos", "Retiros", "Depósitos"],
        datasets: [{
            label: "Monto Promedio por Tipo de Operación",
            data: [1500, 800, 2000, 1200],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
        }]
    },
 
    monthlyTransactionFlow: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
            {
                label: "Entradas",
                data: [8000, 9500, 8700, 9800, 10200, 11000],
                borderColor: '#36a2eb',
                fill: false
            },
            {
                label: "Salidas",
                data: [7500, 8800, 8200, 9000, 9500, 10000],
                borderColor: '#ff6384',
                fill: false
            }
        ]
    },
 
    userBalanceDistribution: {
        labels: ["0-1000", "1001-5000", "5001-10000", "10001+"],
        datasets: [{
            label: "Distribución de Saldos",
            data: [120, 250, 180, 80],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
        }]
    }
 };
 
 export default mockData;
