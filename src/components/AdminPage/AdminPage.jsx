import React, { useState, useEffect } from 'react';
import 'chartjs-adapter-date-fns';
import LineChart from '../charts/LineChart/LineChart'
import PieChart from '../charts/PieChart/PieChart'
import RegisterEmployee from '../RegisterEmployee/RegisterEmployee';
import RegisterProduct from '../RegisterProduct/RegisterProduct';
import { Container, Row, Col, Button, Navbar, Stack } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';


const AdminPage = (props) => {

    return (
        <div>
            <Navbar className="admin-navbar-logo-nav">
                <Container fluid>
                    <Navbar.Brand>
                        <Stack className="nav-logo" direction="horizontal" gap={3}>
                            <img
                                src={ShopLogo}
                                width="50"
                                height="50"
                                className="d-inline-block align top"
                                alt="ShopLogo"
                            />
                            <div className="vr" />
                            <p className="company-name">Aisles</p>
                            <p className="company-description">Food and Drug</p>
                        </Stack>
                    </Navbar.Brand>
                    <div className="text-end">
                        <Stack direction="horizontal" gap={3}>
                            <div>{`Welcome Admin`}</div>
                            <div className="vr"/>
                            <Button onClick={()=>props.logout()}>Logout</Button>
                        </Stack>
                    </div>
                </Container>
            </Navbar>
            <div>
                <Row>

                </Row>
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
                            <RegisterProduct 
                                products={props.products}
                            />
                        </div>
                    </Col>
                    <br/>
                    <Col>
                        <div>
                            <RegisterEmployee 
                                users={props.users}
                            />
                        </div>
                    </Col>
                </Row>
                <br/>
                <br/>
            </div>
        </div>
    )
}

export default AdminPage;