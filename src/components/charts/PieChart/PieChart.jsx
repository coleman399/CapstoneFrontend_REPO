import React from 'react';
import 'chartjs-adapter-date-fns';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const PieChart = (props) => {
    const data = {
        labels: ["Total Sales", "Total Expenses", "Total Profit"],
        datasets: [ 
            { 
                data: [props.totalSales, props.totalExpenses, props.totalProfit],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ]
            }
        ]
    }

    return (
        <div>
            <div>
                <Pie 
                    data={data} 
                />
            </div>
        </div>
    )
}

export default PieChart;