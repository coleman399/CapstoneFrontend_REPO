import React, { useState, useEffect } from 'react';
import { Spinner, Container, Row, Col, Navbar, Image, Stack, Carousel, Card, Button, ListGroup, Form, InputGroup, FormControl } from 'react-bootstrap';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import EmployeeOne from '../assets/Employee1_Preview.png';
import EmployeeTwo from '../assets/Employee2_Preview.png';
import EmployeeThree from '../assets/Employee3_Preview.png';
import ProductImage from '../assets/100x100.png';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import './CustomerPage.css';

const CustomerPage = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [counter, setCounter] = useState(0);
    const [productIds, setProductIds] = useState([]);
    const [decodedToken, setDecodedToken] = useState();

    useEffect(() => {
        getToken();    
        getProducts();
        getShoppingCart();   
    },[toggle])

    //add try-catch
    const getProducts = async () => {
        var results = await axios ({
            method: 'GET',
            url: 'http://127.0.01:8000/api/products/'
        })
        console.log(results.data);
        setProducts(results.data)
    }

    //add try-catch
    const getShoppingCart = async () => {
        await axios ({
            method: 'GET',
            url: 'http://127.0.01:8000/api/shoppingcarts/'
        }).then((response) =>{
            console.log(response.data)
            setShoppingCart(response.data);
            getShoppingCartCount();
            getProductIds();
        })
    }

    const getToken = () => {
        const jwt = localStorage.getItem('token')
        const dced_user = jwtDecode(jwt)
        setDecodedToken(dced_user)
    }

    const getShoppingCartCount = () => {
        let tempCounter = 0;
        shoppingCart.filter((sc) => { 
            if (sc.user === decodedToken.user_id) {
                tempCounter = tempCounter + sc.quantity
            }
        })
        setCounter(tempCounter)
        console.log(counter)
        renderToggle();   
    }
    
    const renderToggle = () => {
        setToggle(!toggle);
    }

    const getProductIds = () => {
        let array = [];
        shoppingCart.filter((sc) => {
            if (sc.user === decodedToken.user_id) {
                let newProductIds = array.concat(sc.product)
                array = newProductIds
            }
        })
        setProductIds(array);
        console.log(productIds);
        renderToggle();
    }

    //add try-catch 
    const addToShoppingCart = async (product) => {
        if (productIds.includes(product.id)) {
            shoppingCart.filter( async (sc) => {
                if (sc.product === product.id) { 
                    await axios ({
                        method: 'PUT',
                        url: 'http://127.0.01:8000/api/shoppingcarts/' + sc.id + '/',
                        data: {
                            user: `${sc.user}`,
                            product: `${sc.product}`,
                            quantity: sc.quantity + 1,
                        }
                    }).then((response) => {
                        console.log(response.data);
                        renderToggle();               
                    })
                }
            })
        } else {
            await axios ({
                method: 'POST',
                url: 'http://127.0.01:8000/api/shoppingcarts/',
                data: {
                    user: `${decodedToken.user_id}`,
                    product: `${product.id}`,
                    quantity: 1,
                }
            }).then((response) => {
                console.log(response.data);
                renderToggle();
            }) 
        }
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
                    <Container>
                        <div className="col align-self-start">
                              <InputGroup>
                                <FormControl
                                    placeholder="Search"
                                    aria-label="Search"
                                    aria-describedby="basic-addon2"
                                    type="text"
                                    onChange={event => {setSearchTerm(event.target.value)}}
                                />
                            </InputGroup>
                        </div>
                        <div className="col"/>
                        <div className="col">
                            <div className="shopping-cart-button">
                                <button type="button" className="btn btn-primary position-relative">
                                    Shopping Cart 🛒
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {counter}
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </Container>
                </Navbar>
                <Container className="shop-container-content" fluid>
                    <br/>
                    <div className="product-list">
                        {products.length > 0 ?
                            products.filter((product) => {
                                if (searchTerm === '') {
                                    return product;
                                } else if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
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
                                                Some quick example text to build on the card title and make up the bulk of
                                                the card's content.
                                                </Card.Text>
                                                <div className="info-buy-buttons">
                                                    <Stack direction="horizontal" gap={5}>
                                                        <Button> ℹ️ </Button>
                                                        <div className="vr" />
                                                        <Button onClick={()=>addToShoppingCart(product)} type="submit"> 🛒 </Button>
                                                    </Stack>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        <br/> 
                                    </div>                               
                                )
                            })
                        :
                            <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </Spinner>
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