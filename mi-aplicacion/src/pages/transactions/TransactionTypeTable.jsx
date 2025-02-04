import React, { useState, useContext} from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';

// Create an array of month numbers 1-12 for filtering
const monthNumbers = Array.from({length: 12}, (_, i) => i + 1);

const TransactionTypeTable = ({ transactions }) => {
    const [selectedMonth, setSelectedMonth] = useState(1);
    const { language } = useContext(LanguageContext);

    // Get unique years from transactions
    const years = [...new Set(transactions.map(t => parseFloat(t.Anho)))];
    const latestYear = Math.max(...years);

    // Filter transactions by selected month and latest year
    const filteredTransactions = transactions.filter(t => 
        monthNumbers.includes(parseFloat(t.Mes)) && 
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
                    <label htmlFor="month-select" className="month-label">{translate.selectMonth[language]}:</label>
                    <select 
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseFloat(e.target.value))}
                        className="month-select-input"
                    >
                        {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                                {translate.monthsLong[num][language]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="transaction-type-summary">
                <div className="summary-item">
                    <span className="summary-label">{translate.year[language]}:</span>
                    <span className="summary-value">{latestYear}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">{translate.totalTransactions[language]}:</span>
                    <span className="summary-value">{totalTransactions.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">{translate.totalAmount[language]}:</span>
                    <span className="summary-value">{totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</span>
                </div>
            </div>

            <div className="transaction-type-table-wrapper">
                <table className="transaction-type-table">
                    <thead>
                        <tr>
                            <th>{translate.operationType[language]}</th>
                            <th>{translate.transactionsNumber[language]}</th>
                            <th>{translate.totalAmount[language]} (€)</th>
                            <th>{translate.totalPercentage[language]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => {
                            const transactionPercentage = 
                                (parseFloat(transaction.Dinero_total) / totalAmount * 100).toFixed(2);
                            return (
                                <tr key={index}>
                                    <td>{translate.operationTypes[transaction.Tipo_operacion]?.[language] || transaction.Tipo_operacion}</td>
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