import React, { useState } from 'react';

const monthTranslations = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
    5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
    9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

const TransactionTypeTable = ({ transactions }) => {
    const [selectedMonth, setSelectedMonth] = useState(1);

    // Get unique years from transactions
    const years = [...new Set(transactions.map(t => parseFloat(t.Anho)))];
    const latestYear = Math.max(...years);

    // Filter transactions by selected month and latest year
    const filteredTransactions = transactions.filter(t => 
        parseFloat(t.Mes) === selectedMonth && 
        parseFloat(t.Anho) === latestYear
    );

    // Calculate total transactions and total amount for the selected month
    const totalTransactions = filteredTransactions.reduce((sum, t) => 
        sum + parseInt(t.num_transacciones), 0);
    const totalAmount = filteredTransactions.reduce((sum, t) => 
        sum + parseFloat(t.Dinero_total), 0);

    return (
        <div className="transaction-type-container">
            <div className="transaction-type-header">
                <div className="month-selector">
                    <label htmlFor="month-select" className="month-label">Seleccionar Mes:</label>
                    <select 
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseFloat(e.target.value))}
                        className="month-select-input"
                    >
                        {Object.entries(monthTranslations).map(([num, name]) => (
                            <option key={num} value={num}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="transaction-type-summary">
                <div className="summary-item">
                    <span className="summary-label">Año:</span>
                    <span className="summary-value">{latestYear}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Total Transacciones:</span>
                    <span className="summary-value">{totalTransactions.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Importe Total:</span>
                    <span className="summary-value">{totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</span>
                </div>
            </div>

            <div className="transaction-type-table-wrapper">
                <table className="transaction-type-table">
                    <thead>
                        <tr>
                            <th>Tipo de Operación</th>
                            <th>Número de Transacciones</th>
                            <th>Dinero Total (€)</th>
                            <th>% del Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => {
                            const transactionPercentage = 
                                (parseFloat(transaction.Dinero_total) / totalAmount * 100).toFixed(2);
                            return (
                                <tr key={index}>
                                    <td>{transaction.Tipo_operacion}</td>
                                    <td>{parseInt(transaction.num_transacciones).toLocaleString()}</td>
                                    <td>{parseFloat(transaction.Dinero_total).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</td>
                                    <td>{transactionPercentage}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTypeTable;