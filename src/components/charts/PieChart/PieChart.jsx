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
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
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
                <br/>
            </div>
        </div>
    )
}

export default PieChart;