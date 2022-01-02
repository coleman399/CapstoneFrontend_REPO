import React, { useState } from 'react';
import { Form, Button, Container, Stack, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import './RegisterProduct.css';

const RegisterProduct = (props) => {
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [salesPrice, setSalesPrice] = useState()
    const [manufacturingCost, setManufacturingCost] = useState()
    const [aisleName, setAisleName] = useState()
    const [update, setUpdate] = useState(false)
    let tempProduct = {
        name: name,
        description: description,
        salesPrice: salesPrice,
        manufacturingCost: manufacturingCost,
        aisleName: aisleName,
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const jwt = localStorage.getItem('token');
        if (update === false) {
            try{
                await axios ({
                    method: "POST",
                    url: 'http://127.0.01:8000/api/products/',
                    data: {
                        name: tempProduct.name,
                        description: tempProduct.description,
                        salesPrice: tempProduct.salesPrice,
                        manufacturingCost: tempProduct.manufacturingCost,
                        aisleName: tempProduct.aisleName,
                    },
                });
                console.log(tempProduct);
                alert("🎉 Product Registered! 🎉")           
                window.location.reload();
            } catch (e) {
                if (e.response.status === 401) {
                    alert("Unauthorized access. Please try again.")
                    window.location.reload();
                } else if (e.response.status === 400){
                    let newMessage = JSON.stringify(e.response.data)
                    alert("😱\n" + " " + newMessage)
                    window.location.reload();
                } else {
                    console.log(e)
                    alert("Oops... Something went wrong. 😥")
                    window.location.reload();
                }
            }
        } else {
            try {
                let id;
                props.products.forEach(product => {
                    if(product.name === tempProduct.name) {
                        id = product.id;
                    }
                })
                if (id === undefined) {
                    alert("😞 Sorry, Product Not Found. Please try again!") 
                    window.location.reload();
                } else {
                    await axios ({
                    method: "PUT",
                    url: 'http://127.0.0.1:8000/api/products/' + id + "/",
                    data: {
                        name: tempProduct.name,
                        description: tempProduct.description,
                        salesPrice: tempProduct.salesPrice,
                        manufacturingCost: tempProduct.manufacturingCost,
                        aisleName: tempProduct.aisleName,
                    },
                    }).then(response => {
                    console.log(response.data)
                    })
                    alert("🎉 Product Updated! 🎉") 
                    window.location.reload();
                }
            } catch (e) {
                if (e.response.status === 401) {
                alert("Unauthorized access. Please try again.")
                window.location.reload();
                } else if (e.response.status === 400) {
                let newMessage = JSON.stringify(e.response.data)
                alert("😱\n" + " " + newMessage)
                window.location.reload();
                } else {
                console.log(e)
                alert("Oops... Something went wrong. 😥")
                window.location.reload();
                }
            }
        }
    }

    return ( 
      <div>
        <Container>
            <Row>
                <Col>
                    <div className="p-5 border rounded bg-white">
                        <h4 className="text-center">Register Product</h4>
                        <br/>
                        <Form className="Register" onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control onChange={e => setName(e.target.value)} type="text" required />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control onChange={e => setDescription(e.target.value)} type="textarea"/>
                            <Form.Group controlId="sales-price">
                                <Form.Label>Sales Price</Form.Label>
                                <Form.Control onChange={e => setSalesPrice(e.target.value)} type="text" required />
                            </Form.Group>
                            </Form.Group>
                            <Form.Group controlId="manufacturing-cost">
                                <Form.Label>Manufacturing Cost</Form.Label>
                                <Form.Control onChange={e => setManufacturingCost(e.target.value)} type="text" required />
                            </Form.Group>
                            <Form.Group controlId="aisle-name">
                                <Form.Label>Aisle Name</Form.Label>
                                <Form.Select onChange={e => setAisleName(e.target.value)} aria-label="Default select example" required>
                                    <option>Open this select menu</option>
                                    <option value="Food">Food</option>
                                    <option value="Drink">Drink</option>
                                    <option value="Misc">Misc</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="UpdateProduct">
                                <Form.Check type="switch" label="Update" as="input" onChange={e => setUpdate(!update)}/>
                            </Form.Group>
                            <br/>
                            <div className="text-center">
                                <Button type="submit">Submit</Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
      </div>
    );
}
 
export default RegisterProduct;