import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Image, Stack, Carousel, Card, Button, ListGroup } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import EmployeeOne from '../assets/Employee1_Preview.png';
import EmployeeTwo from '../assets/Employee2_Preview.png';
import EmployeeThree from '../assets/Employee3_Preview.png';
import ProductImage from '../assets/100x100.png';
import axios from 'axios';
import './CustomerPage.css';



const CustomerPage = (props) => {
    const [products, setProducts] = useState('');
    
    useEffect(() =>{
        getProducts();
    },[])

    const getProducts = async () => {
        var results = await axios ({
            method: 'GET',
            url: 'http://127.0.01:8000/api/products/'
        })
        console.log(results.data);
        setProducts(results.data)
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
                        <h2 className="carousel-header-two">Here Only For You</h2>
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
                    <Container fluid>
                        <br/>
                    </Container>
                </Navbar>
                <Container className="shop-container-content" fluid>
                    <br/>
                    <div className="product-list">
                        {products.length > 0 ?
                            products.map((val, key)=> {
                                return (
                                    <div>
                                        <br/>
                                        <Card style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={ProductImage} />
                                            <Card.Body>
                                                <Card.Title>{val.name}</Card.Title>
                                                <Card.Text>
                                                Some quick example text to build on the card title and make up the bulk of
                                                the card's content.
                                                </Card.Text>
                                                <Button variant="primary">Go somewhere</Button>
                                            </Card.Body>
                                        </Card>
                                        <br/> 
                                    </div>                               
                                )
                            })
                        :
                            "No Products"
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