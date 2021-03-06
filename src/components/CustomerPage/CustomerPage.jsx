import React, { useState, useEffect } from 'react';
import { Col, Spinner, Container, Navbar, Stack, Carousel, Card, Button, InputGroup, FormControl, OverlayTrigger, Popover } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import EmployeeOne from '../assets/Employee1_Preview.png';
import EmployeeTwo from '../assets/Employee2_Preview.png';
import EmployeeThree from '../assets/Employee3_Preview.png';
import ProductImage from '../assets/100x100.png';
import axios from 'axios';
import './CustomerPage.css';
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const CustomerPage = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [aisle, setAisle] = useState('');
    let navigate = useNavigate()

    const goToShoppingCartPage = () => {
        navigate("/shopping-cart")
    }

    //add try-catch 
    const addToShoppingCart = async product => {
        const jwt = localStorage.getItem('token');
        const dced_user = jwtDecode(jwt);
        let exist = false;
        let shoppingCart;
        props.shoppingCart.filter(sc => {
            if (sc.product === product.id) {
                exist = true;
                shoppingCart = sc;
        }}); 
        if (exist === true) {
            await axios ({
                method: 'PUT',
                url: 'http://127.0.01:8000/api/shoppingcarts/' + shoppingCart.id + '/',
                data: {
                    user: `${dced_user.employee_id}`,
                    product: `${shoppingCart.product}`,
                    quantity: shoppingCart.quantity + 1,
                }
            }).then((response) => {
                console.log(response.data);
                props.renderToggle();
            })                  
        } else {
            await axios ({
                method: 'POST',
                url: 'http://127.0.01:8000/api/shoppingcarts/',
                data: {
                    user: `${dced_user.employee_id}`,
                    product: `${product.id}`,
                    quantity: 1,
                }
            }).then((response) => {
                console.log(response.data);
                props.renderToggle();
            })
        }
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

    return (
        <div className="customer-background">
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
                        <Stack direction="horizontal" gap={3}>
                            <div>{`Welcome ${props.user.first_name}`}</div>
                            <div className="vr"/>
                            <Button onClick={()=>props.logout()}>Logout</Button>
                        </Stack>
                    </div>
                </Container>
            </Navbar>
            <Carousel controls="false" fade>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={EmployeeOne}
                        alt="First slide"
                    />
                    <Carousel.Caption className="border rounded-pill">
                        <h2 className="carousel-header-one">Providing Employees Discounts Since 2019</h2>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={EmployeeTwo}
                        alt="Second slide"
                    />
                    <Carousel.Caption className="border rounded-pill">
                        <h2 className="carousel-header-two">Only For You and Your Family</h2>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={EmployeeThree}
                        alt="Third slide"
                    />
                    <Carousel.Caption className="border rounded-pill">
                        <h2 className="carousel-header-three">Family Quality and Prices</h2>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <br/>
            <br/>
            <Container className="shop-container" fluid>
                <br/>
                <div className="border rounded">
                <Navbar className="navbar-shop-nav border rounded">
                    <Container >
                        <Container>
                            <Stack direction="horizontal" gap={3}>
                                <Col xs={6}>
                                <InputGroup>
                                    <FormControl
                                        placeholder="Search"
                                        aria-label="Search"
                                        aria-describedby="basic-addon2"
                                        type="text"
                                        onChange={event => {setSearchTerm(event.target.value)}}
                                        />
                                        </InputGroup>
                                </Col>
                                <div className="vr"/>
                                <Col>
                                    <Button onClick={()=>setAisleToFood()}>Food Aisle</Button>
                                </Col>
                                <div className="vr"/>
                                <Col>
                                    <Button onClick={()=>setAisleToDrink()}>Drink Aisle</Button>
                                </Col>
                                <div className="vr"/>
                                <Col>
                                    <Button onClick={()=>setAisleToMisc()}>Misc Aisle</Button>
                                </Col>
                                <div className="vr"/>
                                <Col>
                                    <Button onClick={()=>setAisleToAll()}>All Aisles</Button>
                                </Col>
                                <div className="vr"/>
                                <Col>
                                <div className="shopping-cart-button">
                                    <button type="button" onClick={()=>goToShoppingCartPage()}className="btn btn-primary position-relative">
                                    Shopping Cart ????
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {props.counter}
                                        <span className="visually-hidden">Items in Cart</span>
                                    </span>
                                    </button>
                                </div>
                                </Col>
                            </Stack>
                        </Container>                            
                    </Container>
                </Navbar>
                <Container className="shop-container-content" fluid>
                    <br/>
                    <div className="product-list">
                        {props.products.length > 0 ?
                            props.products.filter((product) => {
                                if (searchTerm === '' && aisle === '') {
                                    return product;
                                } else if (searchTerm === '' && aisle === product.aisleName) {
                                    return product;
                                } else if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) && aisle === '') {
                                    return product;
                                } else if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) && aisle === product.aisleName) {
                                    return product;
                                }
                            }).map((product, key) => {
                                return (
                                    <div className="product-card" key={key}>
                                        <br/>
                                        <Card style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={ProductImage} />
                                            <Card.Body>
                                                <Card.Title>{product.name}</Card.Title>
                                                <Card.Text>
                                                    {product.description}
                                                </Card.Text>
                                                <div className="text-center">{`Price: ${props.formatNumber(product.salesPrice)}`}</div>
                                                <div className="info-buy-buttons">
                                                    <Stack direction="horizontal" gap={5}>
                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement="bottom"
                                                            overlay={
                                                                <Popover>
                                                                    <Popover.Header as="h3">{`Product Information`}</Popover.Header>
                                                                    <Popover.Body>
                                                                        <strong>Holy guacamole!</strong> Check this all this info.
                                                                    </Popover.Body>
                                                                </Popover>
                                                            }
                                                        >
                                                            <Button> ?????? </Button>
                                                        </OverlayTrigger>
                                                        <div className="vr" />
                                                        <Button onClick={()=>addToShoppingCart(product)} type="submit"> ???? </Button>
                                                    </Stack>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        <br/> 
                                    </div>                               
                                )
                            })
                        :
                            <div className="text-center">
                                <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        }
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </Container>
                </div>
                <br/>
            </Container>
            <br/>
        </div>
    )
}

export default CustomerPage;