import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import 'chartjs-adapter-date-fns';

const AdminPage = (props) => {
    const [data, setData]=useState();
    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month'
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    useEffect(()=>{
        getData();
    },[])

    const getData = () => {
        setData({
            datasets: [{
                label: "Sales",
                data: props.budget.total_sales,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }],
        });
    }

    return (
        <div>
            <p>Administration Page</p>
            <div>
            {((!props.budget)?
                <Line options={options} data={data}/>
                :
                "nothing"
                )
            }
            </div>
        </div>
    )
}

export default AdminPage;