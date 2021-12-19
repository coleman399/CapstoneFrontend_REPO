import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Stack, Col, Row, Figure, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = (props) => {
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let results = await axios({
                method: 'POST',
                url: "http://127.0.0.1:8000/api/auth/login/",
                data: { 
                    username: userName,
                    password: userPassword
                },
            })
            setUserName('');
            setUserPassword('');
            localStorage.setItem('token', results.data.access);
            console.log(results)
            window.location.href = "/";
        } catch (e) {
        if (e.response.status === 401) {
            alert("Unauthorized access. Please try again.")
            document.forms[0].reset();

        } else {
            console.log(e)
            alert("Oops... Something went wrong. 😥")
            document.forms[0].reset();
        }}
    }
    
    function handleOnClick(){
        navigate("/register")
    }

    return ( 
        <div className="bg">
            <Container>
                <Row className="justify-content">
                    <Col>
                        <div className="p-5 position-absolute top-50 start-50 translate-middle border rounded bg-white">
                            <h4 className="text-center">Sign In</h4>
                            <br/>
                            <Form className="Login" onSubmit={handleSubmit}>
                                <Form.Group controlId="username">
                                <Form.Label>User Name</Form.Label>
                                    <Form.Control onChange={e => setUserName(e.target.value)} placeholder="" type="text" required />
                                </Form.Group>   
                                <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={e => setUserPassword(e.target.value)} placeholder="" type="text" required />
                                </Form.Group>
                                <br/>
                                <Stack direction="horizontal" gap={5}>
                                    <Button onClick={()=>handleOnClick()}>Register</Button>
                                    <div className="vr" />
                                    <Button type="submit">Submit</Button>
                                </Stack>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
     );
}
 
export default Login;