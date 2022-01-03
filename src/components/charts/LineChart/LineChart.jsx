import React from 'react';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const LineChart = (props) => {   
    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            }
        }  
    }

    const data ={
        datasets: [
            { 
                label: "Total Sales",
                data: props.totalSales,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.1
            },
            {
                label: "Total Expenses",
                data: props.totalExpenses,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            },
            {
                label: "Total Profit",
                data: props.totalProfit,
                fill: false,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                tension: 0.1
            } 
        ]
    }

    return (
        <div>
            <div>
                <Line 
                    options={options}
                    data={data}
                />
            </div>
        </div>
    )
}

export default LineChart;