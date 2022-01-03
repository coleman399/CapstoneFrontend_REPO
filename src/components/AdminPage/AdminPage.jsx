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
        <div className="admin-page">
            <Navbar className="admin-navbar-logo-nav border rounded bg-white">
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
                <br />
                <Row>
                    <Col/>
                    <Col lg={11}>
                        <div className="border rounded bg-white text-center">
                            <br />
                            <h5>
                                Message Board
                            </h5>
                            <br />
                            <Container>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a tempor sem, eu commodo nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum et dui egestas, ultrices velit eu, fermentum magna. Sed a neque ac magna porta posuere. Cras ultricies mi sed faucibus euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec sodales fermentum augue ut fermentum. Sed ornare massa nunc, non tempor lorem cursus vitae. Sed volutpat, lorem a luctus elementum, metus massa congue est, eu condimentum dui sem quis mauris.

                                    Curabitur vel bibendum nunc. Donec lacinia, turpis quis gravida tincidunt, mi arcu iaculis magna, sit amet interdum metus leo in ligula. Vestibulum non purus quis erat ultrices sodales quis ut odio. Etiam egestas auctor tempus. Suspendisse id sollicitudin leo, vel sollicitudin eros. Morbi semper eros at turpis luctus egestas. Cras sed massa felis.

                                    Nam sodales nisi et massa vestibulum, at pulvinar ante fringilla. Pellentesque vel ipsum tellus. Vestibulum at massa sed risus tempus elementum ac nec enim. Integer ullamcorper blandit feugiat. Vestibulum ut efficitur nulla. Nam pretium arcu eget felis dictum, non vulputate lectus tristique. Mauris bibendum vestibulum metus, vitae cursus ipsum euismod nec. Aliquam lacus velit, dignissim sagittis felis id, elementum convallis ligula. Nam fermentum ligula venenatis sem facilisis, vel laoreet felis sollicitudin.
                                </p>
                            </Container>
                            <br />
                        </div>
                    </Col>
                    <Col/>
                </Row>
                <br />
                <Row>
                    <div className="border rounded bg-white">
                        <Stack className="Charts" direction="horizontal" gap={0}>
                            <Col xs={12} md={8}>
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
                            <Col xs={6} md={4}>
                                <Container fluid>
                                    <br />
                                    <div className="pie-chart">
                                        <PieChart
                                            totalSales={props.budget.total_sales}
                                            totalExpenses={props.budget.total_expenses}
                                            totalProfit={props.budget.total_profit}
                                        />
                                    </div>
                                </Container>
                            </Col>
                        </Stack>

                    </div>
                </Row>
                <br/>
                <Row>
                    <Col xs={6}>
                        <div>
                            <RegisterProduct 
                                products={props.products}
                                renderToggle={props.renderToggle}
                            />
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div>
                            <RegisterEmployee 
                                users={props.users}
                                budget={props.budget}
                                renderToggle={props.renderToggle}
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