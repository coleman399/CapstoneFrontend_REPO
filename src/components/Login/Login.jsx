import React from 'react';
import { Form, Button, Container, Col, Row, Image } from 'react-bootstrap';
import axios from 'axios';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import './Login.css';
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Login = (props) => {
    let navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();  
        try {
            await axios({
                method: 'POST',
                url: "http://127.0.0.1:8000/api/auth/login/",
                data: { 
                    employee_id: props.employeeId,
                    password: props.userPassword
                },
            }).then(response => {
                localStorage.setItem('token', response.data.access);
                console.log(response.data)
                if (props.userPassword === "tempPassword1") {
                    const jwt = localStorage.getItem('token');
                    const dced_user = jwtDecode(jwt);
                    props.login(jwt, dced_user);
                    navigate("/update-password");
                } else {          
                    window.location.href = "/";
                }
            })
        } catch (e) {
            if (e.response.status === 401) {
                alert("Unauthorized access. Please try again.")
                let form = document.getElementById('login-form');
                form.reset() 
            } else if (e.response.status === 400) {
                let newMessage = JSON.stringify(e.response.data)
                alert("😱\n" + " " + newMessage)
                let form = document.getElementById('login-form');
                form.reset()       
            } else {
                console.log(e)
                alert("Oops... Something went wrong. 😥")
                let form = document.getElementById('login-form');
                form.reset() 
            }
        }
    }
    

    return ( 
        <div className="login-background">
            <Container>
                <Row className="justify-content">
                    <Col>
                        <div className="p-5 position-absolute top-50 start-50 translate-middle border rounded bg-white">
                            <div className="text-center">
                                <Image src={ShopLogo} alt="ShopLogo" roundedCircle/>
                                <br/>
                                <br/>
                                <h4>Sign In</h4>
                            </div>
                            <br/>
                            <Form className="login-form" id="login-form" onSubmit={handleSubmit}>
                                <Form.Group controlId="employee_id">
                                <Form.Label>Employee Id</Form.Label>
                                    <Form.Control onChange={e => props.setEmployeeId(e.target.value)} placeholder="" type="text" required />
                                </Form.Group>   
                                <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={e => props.setUserPassword(e.target.value)} placeholder="" type="password" required />
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
 
export default Login;