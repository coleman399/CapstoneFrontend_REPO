import React, { useState, useEffect } from 'react';
import 'chartjs-adapter-date-fns';
import LineChart from '../charts/LineChart/LineChart'
import PieChart from '../charts/PieChart/PieChart'
import RegisterEmployee from '../RegisterEmployee/RegisterEmployee';
import RegisterProduct from '../RegisterProduct/RegisterProduct';
import { Container, Row, Col } from 'react-bootstrap';


const AdminPage = (props) => {

    return (
        <div>
            <div>
                <Row>

                </Row>
                <br/>
                <br/>
                <br/>
                <Row>
                    <Col xs lg="8">
                        <Container fluid>
                            <div className="line-chart">
                                <LineChart 
                                    totalSales={props.totalSales} 
                                    totalExpenses={props.totalExpenses} 
                                    totalProfit={props.totalProfit}
                                />
                            </div>
                        </Container>
                    </Col>
                    <Col xs lg="4">
                        <Container fluid>
                            <div className="pie-chart">
                                <PieChart
                                    totalSales={props.budget.total_sales}
                                    totalExpenses={props.budget.total_expenses}
                                    totalProfit={props.budget.total_profit}
                                />
                            </div>
                        </Container>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col >
                        <div>
                            <RegisterProduct />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <RegisterEmployee />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default AdminPage;