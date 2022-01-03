import React, { useState } from 'react';
import 'chartjs-adapter-date-fns';
import LineChart from '../charts/LineChart/LineChart'
import PieChart from '../charts/PieChart/PieChart'
import RegisterEmployee from '../RegisterEmployee/RegisterEmployee';
import RegisterProduct from '../RegisterProduct/RegisterProduct';
import { Container, Row, Col, Button, Navbar, Stack, ListGroup, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = (props) => {
    const [productSearch, setProductSearch] = useState('');
    const [employeeSearch, setEmployeeSearch] = useState('');
    const [aisle, setAisle] = useState('');
    const [editProduct, setEditProduct] = useState(false);
    const [editThisProduct, setEditThisProduct] = useState();
    const [editEmployee, setEditEmployee] = useState(false);
    const [editThisEmployee, setEditThisEmployee] = useState();
    const productAnchor = React.createRef()
    const employeeAnchor = React.createRef()
    
    const editProductStatus = (product) => {
        setEditThisProduct(product)
        setEditProduct(true);
        productAnchor.current.scrollIntoView()  
    }

    const setAisleToFood = () => {
        setAisle("Food");
        props.renderToggle();
    }

    const setAisleToDrink = () => {
        setAisle("Drink");
        props.renderToggle();
    }
    
    const setAisleToMisc = () => {
        setAisle("Misc");
        props.renderToggle();
    }

    const setAisleToAll = () => {
        setAisle("");
        props.renderToggle();
    }

    const deleteProduct = async (product) => {
        try {
            await axios ({
                method: "DELETE",
                url: 'http://127.0.0.1:8000/api/products/' + product.id + "/",
            }).then(response => {
            console.log(response.data)
            })
            alert("🎉 Product Deleted! 🎉")
            props.renderToggle();
        } catch(e) {
            if (e.response.status === 401) {
                alert("Unauthorized access. Please try again.")
            } else if (e.response.status === 400) {
                let newMessage = JSON.stringify(e.response.data)
                alert("😱\n" + " " + newMessage)
            } else {
                console.log(e)
                alert("Oops... Something went wrong. 😥")
            }
        }
    }

    const editEmployeeStatus = (employee) => {
        setEditThisEmployee(employee)
        setEditEmployee(true);
        employeeAnchor.current.scrollIntoView()  
    }

    const deleteEmployee = async (employee) => {
        try {
            let prev_expenses = parseFloat(props.budget.total_expenses) - parseFloat(employee.salary)
            let expenses = (prev_expenses).toFixed(2);
            let prev_profit = parseFloat(props.budget.total_profit) + parseFloat(employee.salary)
            let profit = (prev_profit).toFixed(2);
            const jwt = localStorage.getItem('token');
            await axios ({
                method: "DELETE",
                url: 'http://127.0.0.1:8000/api/auth/' + employee.id + "/",
                headers: {Authorization: `Bearer ${jwt}`},
            }).then(response => {
            console.log(response.data)
            })
            await axios ({
                method: "POST",
                url: 'http://127.0.01:8000/api/budgets/',
                data: {
                    total_sales: props.budget.total_sales,
                    total_expenses: expenses,
                    total_profit: profit,
                }
            }).then((response)=>{
                console.log(`budget: ${response.data}`);
            })
            alert("🎉 Employee Deleted! 🎉")
            let form = document.getElementById('register-employee-form');
            form.reset()  
            props.renderToggle(); 
        } catch(e) {
            if (e.response.status === 401) {
                alert("Unauthorized access. Please try again.")
            } else if (e.response.status === 400) {
                let newMessage = JSON.stringify(e.response.data)
                alert("😱\n" + " " + newMessage)
            } else {
                console.log(e)
                alert("Oops... Something went wrong. 😥")
            }
        }
    }

    return (
        <div className="admin-background">
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
                <Container fluid>
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
                </Container>
                <br/>
                <Row>
                    <Col xs={6}>
                        <div ref={productAnchor}>
                            <RegisterProduct 
                                products={props.products}
                                renderToggle={props.renderToggle}
                                editProduct={editProduct}
                                editThisProduct={editThisProduct}
                                setEditProduct={setEditProduct}
                            />
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div ref={employeeAnchor}>
                            <RegisterEmployee 
                                users={props.users}
                                budget={props.budget}
                                renderToggle={props.renderToggle}
                                editEmployee={editEmployee}
                                editThisEmployee={editThisEmployee}
                                setEditEmployee={setEditEmployee}
                            />
                        </div>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs={6}>
                        <div className="border rounded bg-white">
                            <br/>
                            <Container fluid>
                                <Stack direction="horizontal">
                                    <Col>
                                        <Stack direction="horizontal" gap={3}>
                                            <InputGroup>
                                                <FormControl
                                                    placeholder="search"
                                                    aria-label="Search"
                                                    aria-describedby="basic-addon2"
                                                    type="text"
                                                    onChange={event => {setProductSearch(event.target.value)}}
                                                />
                                            <div className="vr"/>
                                            </InputGroup>
                                            <div className="vr"/>
                                            <Button onClick={()=>setAisleToFood()}>Food</Button>
                                            <div className="vr"/>
                                            <Button onClick={()=>setAisleToDrink()}>Drink</Button>
                                            <div className="vr"/>
                                            <Button onClick={()=>setAisleToMisc()}>Misc</Button>
                                            <div className="vr"/>
                                            <Button onClick={()=>setAisleToAll()}>All</Button>
                                        </Stack>
                                    </Col>
                                </Stack>
                            </Container>
                            <br/>
                            <Container fluid>
                                <Stack direction="horizontal">
                                    <Col>
                                        <ListGroup.Item as="li">Name</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Price</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Cost</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Aisle</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Edit</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Delete</ListGroup.Item>
                                    </Col>
                                </Stack>
                            </Container>
                            {props.products.length > 0 ?
                                props.products.filter((product) => {
                                    if (productSearch === '' && aisle === '') {
                                        return product;
                                    } else if (productSearch === '' && aisle === product.aisleName) {
                                        return product;
                                    } else if (product.name.toLowerCase().includes(productSearch.toLowerCase()) && aisle === '') {
                                        return product;
                                    } else if (product.name.toLowerCase().includes(productSearch.toLowerCase()) && aisle === product.aisleName) {
                                        return product;
                                    }
                                }).map((product, key) => {
                                    return (
                                        <Container key={key} fluid>
                                            <Stack direction="horizontal">
                                                <Col>
                                                    <ListGroup.Item as="li">{props.truncate(product.name)}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li">{props.truncate(props.formatNumber(product.salesPrice))}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li">{props.truncate(props.formatNumber(product.manufacturingCost))}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li">{product.aisleName}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li" variant="primary"action onClick={()=>editProductStatus(product)}>Edit</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li" variant="danger" action onClick={()=>deleteProduct(product)}>Delete</ListGroup.Item>
                                                </Col>
                                            </Stack>
                                        </Container>
                                    )
                                })
                            :   
                                <div className="text-center">
                                    <br />
                                    <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            }
                            <br/>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="border rounded bg-white">
                            <br/>
                            <Container fluid>
                                <Stack direction="horizontal">
                                    <Col>
                                        <ListGroup.Item as="li">Employee</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Salary</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Spent</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Admin</ListGroup.Item>
                                    </Col>
                                    <Col>
                                            <ListGroup.Item as="li">Edit</ListGroup.Item>
                                    </Col>
                                    <Col>
                                        <ListGroup.Item as="li">Delete</ListGroup.Item>
                                    </Col>
                                </Stack>
                            </Container>
                            {props.users.length > 0 ?
                                props.users.filter((user) => {
                                    if (employeeSearch === '') {
                                        return user;
                                    } else if (user.employee_id.toLowerCase().includes(employeeSearch.toLowerCase())) {
                                        return user;
                                    }
                                }).map((user, key) => {
                                    return (
                                        <Container key={key} fluid>
                                            <Stack direction="horizontal">
                                                <Col>
                                                    <ListGroup.Item as="li">{props.truncate(user.employee_id)}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li">{props.truncate(props.formatNumber(user.salary))}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li">{props.truncate(props.formatNumber(user.spent))}</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    {user.is_staff === true ?  
                                                        <ListGroup.Item as="li">✔️</ListGroup.Item>
                                                    :
                                                        <ListGroup.Item as="li">❌</ListGroup.Item>   
                                                    }
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li" variant="primary"action onClick={()=>editEmployeeStatus(user)}>Edit</ListGroup.Item>
                                                </Col>
                                                <Col>
                                                    <ListGroup.Item as="li" variant="danger" action onClick={()=>deleteEmployee(user)}>Delete</ListGroup.Item>
                                                </Col>
                                            </Stack>
                                        </Container>
                                    )
                                })
                            :
                                <div className="text-center">
                                    <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            }
                            <br/>
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