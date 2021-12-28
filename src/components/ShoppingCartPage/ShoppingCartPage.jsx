import React, { useState, useEffect } from 'react';
import { Spinner, Container, Offcanvas, Row, Col, Navbar, Image, Stack, Carousel, Card, Button, ListGroup, Form, InputGroup, FormControl } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import jwtDecode from "jwt-decode";
import axios from "axios";

const ShoppingCartPage = (props) => {
    let totalPrice = 0;

    const formatNumber = (number) => {
        let formattedNumber = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD'
        }).format(number);
        return formattedNumber;
    }

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
                </Container>
            </Navbar>
            <Container className="shopping-cart-content"> 
                <div className="shopping-cart">
                    {props.productInfo.length > 0  ?
                        <div>
                            {props.productInfo.map((product, key) => {
                                let productPrice = product.product.salesPrice * product.quantity;
                                totalPrice = totalPrice + productPrice;
                                return (
                                    <div key={key}>
                                        {`Product: ${product.product.name} Quantity: `}
                                        <Button onClick={()=>subtractFromCart(product)}>-</Button>
                                            {product.quantity} 
                                        <Button onClick={()=>addToCart(product)}>+</Button> 
                                        {`Price: ${formatNumber(productPrice)}`}
                                    </div>
                                )
                            })}
                            <div>{`Total: ${formatNumber(totalPrice)}`}</div>
                        </div>                           
                    :
                        `You have no items in your cart. 🤭 `
                    }   
                </div>
            </Container>
        </div>

    );
}

export default ShoppingCartPage;