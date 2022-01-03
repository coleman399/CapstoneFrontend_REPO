import React, { useState } from 'react';
import { Form, Button, Container, Col, Row, Image, Stack } from 'react-bootstrap';
import axios from 'axios';
import ShopLogo from '../assets/ShopLogo171x180_Preview.png';
import './UpdatePassword.css';
import jwtDecode from "jwt-decode";

const UpdatePassword = (props) => {
    const [tempPassword, setTempPassword] = useState('');

    const goToLogin = () => {
        window.location.href = "/"; 
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (tempPassword === props.userPassword) {
            const jwt = localStorage.getItem('token');
            const dced_user = jwtDecode(jwt);
            let prev_id = dced_user.employee_id
            let tempUser = {
                employeeId: props.user.employee_id,
                password: props.userPassword,
                email: props.user.email,
                firstname: props.user.first_name,
                lastname: props.user.last_name,
                is_staff: props.user.is_staff,
                salary: props.user.salary,
                spent: props.user.spent,
                userPassword: props.userPassword
            }
            try {
                await axios({
                    method: 'DELETE',
                    url: 'http://127.0.0.1:8000/api/auth/' + prev_id + "/",
                    headers: {Authorization: `Bearer ${jwt}`},
                }).then(response => {
                    console.log(response.data);
                });
                await axios({
                    method: 'POST',
                    url: "http://127.0.0.1:8000/api/auth/register/",
                    data: { 
                        employee_id: tempUser.employeeId,
                        password: tempUser.password,
                        email: tempUser.email,
                        first_name: tempUser.firstname,
                        last_name: tempUser.lastname,
                        is_staff: tempUser.is_staff,
                        salary: tempUser.salary,
                        spent: tempUser.spent,
                        userPassword: tempUser.password,
                    },
                }).then(response => {
                    console.log(response.data);
                })
                await axios({
                    method: 'POST',
                    url: "http://127.0.0.1:8000/api/auth/login/",
                    data: { 
                        employee_id: tempUser.employeeId,
                        password: tempUser.userPassword
                    },
                }).then(response => {
                    localStorage.setItem('token', response.data.access);
                    console.log(response.data)
                    alert("🎉 Password Updated! 🎉")
                    let form = document.getElementById("update-password-form");
                    form.reset()
                    window.location.href = "/"; 
                });
            } catch (e) {
                if (e.response.status === 401) {
                    alert("Unauthorized access. Please try again.")
                    let form = document.getElementById('update-password-form');
                    form.reset() 
                } else if (e.response.status === 400) {
                    let newMessage = JSON.stringify(e.response.data)
                    alert("😱\n" + " " + newMessage)
                    let form = document.getElementById('update-password-form');
                    form.reset()       
                } else {
                    console.log(e)
                    alert("Oops... Something went wrong. 😥")
                    let form = document.getElementById('update-password-form');
                    form.reset() 
                }
            }
        } else {
            alert("😱 The Passwords You Enter Don't Match. Please try again.")
            let form = document.getElementById('update-password-form');
            form.reset() 
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
                                <h4>Please Update Password</h4>
                                <p>
                                    You are using the default password
                                </p>
                            </div>
                            <Form className="update-password-form" id="update-password-form" onSubmit={handleSubmit}>
                                <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={e => setTempPassword(e.target.value)} placeholder="" type="password" required />
                                </Form.Group>   
                                <Form.Group controlId="confirm-password">
                                <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control onChange={e => props.setUserPassword(e.target.value)} placeholder="" type="password" required />
                                </Form.Group>
                                <br/>
                                <Stack direction="horizontal" gap={5}>
                                    <Col>
                                        <Button onClick={()=>goToLogin()}>Login</Button>
                                    </Col>
                                    <div className="vr"/>
                                    <Col>
                                        <div className="text-end">
                                            <Button type="submit">Submit</Button>
                                        </div>
                                    </Col>
                                </Stack>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
     );
}
 
export default UpdatePassword;