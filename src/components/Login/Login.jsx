import React, { useState } from 'react';
import { Form, Button, Container, Stack, Col, Row, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import './Login.css';

const Login = (props) => {
    const [employeeId, setEmployeeId] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let results = await axios({
                method: 'POST',
                url: "http://127.0.0.1:8000/api/auth/login/",
                data: { 
                    employee_id: employeeId,
                    password: userPassword
                },
            })
            setEmployeeId('');
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
                            <Form className="Login" onSubmit={handleSubmit}>
                                <Form.Group controlId="employee_id">
                                <Form.Label>Employee Id</Form.Label>
                                    <Form.Control onChange={e => setEmployeeId(e.target.value)} placeholder="" type="text" required />
                                </Form.Group>   
                                <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={e => setUserPassword(e.target.value)} placeholder="" type="password" required />
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