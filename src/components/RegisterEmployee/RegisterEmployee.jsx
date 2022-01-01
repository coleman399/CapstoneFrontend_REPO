import React, { useState } from 'react';
import { Form, Button, Container, Stack, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterEmployee.css';

const RegisterEmployee = (props) => {
    const [firstname, setFirstName] = useState()
    const [lastname, setLastName] = useState()
    const [employeeId, setEmployeeId] = useState()
    const [password, setPassword] = useState()
    const [salary, setSalary] = useState()
    const [email, setEmail] = useState()
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()
    let tempUser = {
        employeeId: employeeId,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
        is_staff: isAdmin,
        salary: salary,
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
             await axios ({
                method: "POST",
                url: 'http://127.0.0.1:8000/api/auth/register/',
                 data: {
                    employee_id: tempUser.employeeId,
                    password: tempUser.password,
                    email: tempUser.email,
                    first_name: tempUser.firstname,
                    last_name: tempUser.lastname,
                    is_staff: tempUser.is_staff,
                    salary: tempUser.salary
                },
            });
            console.log(tempUser);
            alert("🎉 Account Created! 🎉")           
            setEmployeeId("");
            setPassword("");
            setEmail("");
            setFirstName("");
            setLastName("");
            setSalary("");
            navigate("/")
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

    return ( 
      <div>
        <Container>
          <Row>
            <Col>
              <div className="p-5 border rounded bg-white">
                <h4 className="text-center">Register Employee</h4>
                <br/>
                <Form className="Register" onSubmit={handleSubmit}>
                    <Form.Group controlId="employeeId">
                      <Form.Label>Employee Id</Form.Label>
                        <Form.Control onChange={e => setEmployeeId(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Temp Password</Form.Label>
                        <Form.Control onChange={e => setPassword(e.target.value)} type="password" required />
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} type="email" required />
                    </Form.Group>
                    </Form.Group>
                    <Form.Group controlId="firstname">
                      <Form.Label>First Name</Form.Label>
                        <Form.Control onChange={e => setFirstName(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="lastname">
                      <Form.Label>Last Name</Form.Label>
                        <Form.Control onChange={e => setLastName(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="lastname">
                      <Form.Label>Salary</Form.Label>
                        <Form.Control onChange={e => setSalary(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="isAdmin">
                      <Form.Check type="switch" label="Admin" as="input" onChange={e => setIsAdmin(!isAdmin)}/>
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
 
export default RegisterEmployee;