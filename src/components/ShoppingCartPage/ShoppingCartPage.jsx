import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Container, Offcanvas, Row, Col, Navbar, Image, Stack, Carousel, Card, Button, ListGroup, Form, InputGroup, FormControl } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import ProductImage from '../assets/100x100.png';
import './ShoppingCartPage.css';

const ShoppingCartPage = (props) => {
    const [show, setShow] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    let navigate = useNavigate();
    let totalPrice = 0.00;
    let totalCost= 0.00;

    const deleteShoppingCart = (shoppingCartId) => {
        props.shoppingCart.filter(async sc => {
            if (sc.id === shoppingCartId) {
                await axios ({
                    method: 'DELETE',
                    url: 'http://127.0.01:8000/api/shoppingcarts/' + shoppingCartId + '/',                  
                }).then((response)=> {
                    console.log(`shopping-cart: ${shoppingCartId} has been deleted`)
                })
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
                        user: `${dced_user.user_id}`,
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
                        user: `${dced_user.user_id}`,
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

    const completePurchase = async () => {
        let price = parseFloat(totalPrice) + parseFloat(props.budget.total_sales);
        let total_price = (price).toFixed(2);
        let cost = parseFloat(totalCost) + parseFloat(props.budget.total_expenses);
        let total_cost = (cost).toFixed(2);
        let saleProfit = total_price - total_cost;
        let profit = parseFloat(saleProfit);
        let total_profit = profit.toFixed(2);
        await axios ({
            method: 'PUT',
            url: 'http://127.0.01:8000/api/budgets/' + 1 + '/',
            data: {
                total_sales: total_price,
                total_expenses: total_cost,
                total_profit: total_profit
            }
        }).then((response)=>{
            console.log(`budget: ${response.data}`);
        })
        props.shoppingCart.forEach(async sc => {
            await axios ({
                method: 'DELETE',
                url: 'http://127.0.01:8000/api/shoppingcarts/' + sc.id + '/',
            })
        })
        props.renderToggle();
        handleHide();
        handleThankYou();
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
        setShowThankYou(true)
    }

    const goBack = () => {
        navigate("/");
    }

    const goToCustomerPage = () => {
        window.location.reload();
        window.location.href = "/";
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
                                    {`Total: ${props.formatNumber(totalPrice)}`}
                                    <div>Complete Purchase?</div>
                                    <div>This is where we would collect payment information.</div> 
                                </Modal.Body>
                                <Modal.Footer>
                                    <Stack direction="horizontal" gap={3}>
                                        <Button onClick={()=>completePurchase()}>Yes</Button>
                                        <div className="vr"/>
                                        <Button onClick={()=>handleHide()}>Cancel</Button>
                                    </Stack>
                                </Modal.Footer>
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