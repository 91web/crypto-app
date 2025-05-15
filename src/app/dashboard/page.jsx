"use client"
import React from 'react'
import CryptoTradingChart from './components/chart'
import CryptoTrading from './components/trade'
import History from './components/history'
const CryptoTradingChartDash = () => {
    return (
        <div className="grid-container">
            <CryptoTradingChart />
            <CryptoTrading />
            <style jsx>{`
                .grid-container {
                    display: grid;
                    gap: 1px;
                    grid-template-columns: 100%;
                }
                @media (min-width: 768px) {
                    .grid-container {
                        grid-template-columns: 65% 35%;
                    }
                }
            `}</style>
            <History />
        </div>
    )
}

export default CryptoTradingChartDash