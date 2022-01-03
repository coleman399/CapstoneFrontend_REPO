import React, { useState } from 'react';
import { Form, Modal, Container, Navbar, Stack, Card, Button } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import ProductImage from '../assets/100x100.png';
import './ShoppingCartPage.css';

const ShoppingCartPage = (props) => {
    const [show, setShow] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    let navigate = useNavigate();
    let totalPrice = 0.00;
    let totalCost= 0.00;

    const deleteShoppingCart = (shoppingCartId) => {
        props.shoppingCart.filter(async sc => {
            if (sc.id === shoppingCartId) {
                await axios ({
                    method: 'DELETE',
                    url: 'http://127.0.01:8000/api/shoppingcarts/' + shoppingCartId + '/',                  
                });
            }
        })
    }

    const subtractFromCart = async (product) => {
        const jwt = localStorage.getItem('token');
        const dced_user = jwtDecode(jwt);
        props.shoppingCart.filter(async sc => {
            if (sc.product === product.product.id){
                await axios ({
                    method: 'PUT',
                    url: 'http://127.0.01:8000/api/shoppingcarts/' + sc.id + '/',
                    data: {
                        user: `${dced_user.employee_id}`,
                        product: `${sc.product}`,
                        quantity: sc.quantity - 1,
                    }
                }).then((response) => {
                    console.log(response.data);
                    if (response.data.quantity <= 0) {
                        deleteShoppingCart(sc.id);
                        if (props.shoppingCart.length === 1) {
                            window.location.reload();
                        }
                    }
                })
            }
        })
        props.renderToggle();
    }

    const addToCart = async (product) => {
        const jwt = localStorage.getItem('token');
        const dced_user = jwtDecode(jwt);
        props.shoppingCart.filter(async sc => {
            if (sc.product === product.product.id){
                await axios ({
                    method: 'PUT',
                    url: 'http://127.0.01:8000/api/shoppingcarts/' + sc.id + '/',
                    data: {
                        user: `${dced_user.employee_id}`,
                        product: `${sc.product}`,
                        quantity: sc.quantity + 1,
                    }
                }).then((response) => {
                    console.log(response.data); 
                    props.renderToggle();
                })
            }
        })
    }

    const completePurchase = async (event) => {
        event.preventDefault(); 
        let jwt = localStorage.getItem('token');
        let dced_user = jwtDecode(jwt);
        if (tempPassword === props.user.userPassword){
            try {
                let prev_id = dced_user.employee_id
                let price = parseFloat(totalPrice) + parseFloat(props.budget.total_sales);
                let total_price = (price).toFixed(2);
                let cost = parseFloat(totalCost) + parseFloat(props.budget.total_expenses);
                let total_cost = (cost).toFixed(2);
                let profit = total_price - total_cost;
                let total_profit = profit.toFixed(2);
                let employeeSpent = parseFloat(totalPrice) + parseFloat(props.user.spent)
                let tempUser = {
                    employee_id: props.user.employee_id,
                    password: tempPassword,
                    email: props.user.email,
                    first_name: props.user.first_name,
                    last_name: props.user.last_name,
                    is_staff: props.user.is_staff,
                    salary: props.user.salary,
                    spent: employeeSpent,
                    userPassword: props.user.userPassword,
                }
                props.shoppingCart.forEach(async sc => {
                    await axios ({
                        method: 'DELETE',
                        url: 'http://127.0.01:8000/api/shoppingcarts/' + sc.id + '/',
                    })
                });
                await axios ({
                    method: "DELETE",
                    url: 'http://127.0.0.1:8000/api/auth/' + prev_id + "/",
                    headers: {Authorization: `Bearer ${jwt}`},
                }).then(response => {
                        console.log(response.data)
                })          
                await axios ({
                    method: "POST",
                    url: 'http://127.0.01:8000/api/budgets/',
                    data: {
                        total_sales: total_price,
                        total_expenses: total_cost,
                        total_profit: total_profit,
                    }
                }).then((post_response)=>{
                    console.log(`budget: ${post_response.data}`);
                })
                await axios ({
                    method: 'POST',
                    url: 'http://127.0.01:8000/api/auth/register/',
                    data: {
                        employee_id: tempUser.employee_id,
                        password: tempUser.password,
                        email: tempUser.email,
                        first_name: tempUser.first_name,
                        last_name: tempUser.last_name,
                        is_staff: tempUser.is_staff,
                        salary: tempUser.salary,
                        spent: tempUser.spent,
                        userPassword: tempUser.userPassword,
                    }
                }).then((response) => {
                    console.log(`employee updated: ${response.data}`);
                });
                await axios({
                    method: 'POST',
                    url: "http://127.0.0.1:8000/api/auth/login/",
                    data: { 
                        employee_id: tempUser.employee_id,
                        password: tempUser.userPassword
                    }
                }).then(response => {
                    localStorage.setItem('token', response.data.access);
                    console.log(response.data) 
                })
                props.renderToggle();
                handleHide();
                handleThankYou();
            } catch (e) {
                if (e.response.status === 401) {
                    alert("Unauthorized access. Please try again.")
                    let form = document.getElementById('complete-purchase-form');
                    form.reset() 
                } else if (e.response.status === 400) {
                    let newMessage = JSON.stringify(e.response.data)
                    alert("😱\n" + " " + newMessage)
                    let form = document.getElementById('complete-purchase-form');
                    form.reset()       
                } else {
                    console.log(e)
                    alert("Oops... Something went wrong. 😥")
                    let form = document.getElementById('complete-purchase-form');
                    form.reset() 
                }
            }
        } else {
            alert("😱 The Password You Enter Is Incorrect. Please try again.")
            let form = document.getElementById('complete-purchase-form');
            form.reset() 
        }
    }

    const getTotals = () => {
        props.productInfo.forEach((product) => {
            let productPrice = product.product.salesPrice * product.quantity;
            let productCost = product.product.manufacturingCost * product.quantity;
            totalPrice = totalPrice + productPrice;
            totalCost = totalCost + productCost;
        })
    }

    const handleShow = () => {
        setShow(true);
    }
    const handleHide = () => {
        setShow(false);
    }

    const handleThankYou = () => {
        setShowThankYou(true);
    }

    const goBack = () => {
        window.location.href = "/"; 
    }

    const goToCustomerPage = () => {
        navigate("/");
    }

    return (
        <div className="shopping-cart-background">
            <Navbar className="navbar-logo-nav">
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
                        <div>{getTotals()}</div>
                        <Stack direction="horizontal" gap={3}>
                            <div>{`Total: ${props.formatNumber(totalPrice)}`}</div>
                            <div className="vr"/>
                            <Button onClick={()=>handleShow()}>Confirm Purchase</Button>
                            <div className="vr"/>
                            <Button onClick={()=>goBack()}>Go Back</Button>
                        </Stack>
                    </div>
                </Container>
            </Navbar>
            <Container className="shop-container" fluid>
                <br/>
                <Container className="shopping-cart-container" fluid>
                    {props.productInfo.length > 0  ?
                        <div className="product-list">
                            {props.productInfo.map((product, key) => {
                                return (                          
                                    <div className="product-card" key={key}>
                                        <br/>
                                        <Card style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={ProductImage} />
                                            <Card.Body>
                                                <Card.Title>{product.product.name}</Card.Title>
                                                <Card.Text>
                                                    {product.product.description}
                                                </Card.Text>
                                                <div className="text-center">{`Price: ${props.formatNumber(product.product.salesPrice*product.quantity)}`}</div>
                                                <div className="info-buy-buttons">
                                                    <Stack direction="horizontal" gap={5}>
                                                        <Button onClick={()=>subtractFromCart(product)}>-</Button>
                                                        <div>{product.quantity}</div> 
                                                        <Button onClick={()=>addToCart(product)}>+</Button> 
                                                    </Stack>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        <br/> 
                                    </div> 
                                )
                            })}
                            <Modal show={show} onHide={()=>handleHide()}>
                                <Modal.Body>
                                    <br/>
                                    <h5>This is where we would collect payment information.</h5>
                                    <br />
                                    {`Total: ${props.formatNumber(totalPrice)}`}
                                    <div>Complete Purchase?</div>
                                    <br/>
                                    <Form className="complete-purchase-form" id="complete-purchase-form" onSubmit={completePurchase}>
                                        <Form.Group controlId="password">
                                        <Form.Label>Password</Form.Label>
                                            <Form.Control onChange={e => setTempPassword(e.target.value)} placeholder="" type="password" required />
                                        </Form.Group>   
                                        <Modal.Footer>
                                            <Stack direction="horizontal" gap={3}>
                                                <Button type="submit">Yes</Button>
                                                <div className="vr"/>
                                                <Button onClick={()=>handleHide()}>Cancel</Button>
                                            </Stack>
                                        </Modal.Footer>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        </div>                           
                    :
                        <div className="text-center"><br/>You have no items in your cart. 🤭<br/><br/></div>
                    }   
                </Container>
                <br/>
            </Container>
            <div>
                <Modal show={showThankYou} >
                    <Modal.Body>
                        Thank you for your purchase! ❤️  
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>goToCustomerPage()}>Go Home</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ShoppingCartPage;