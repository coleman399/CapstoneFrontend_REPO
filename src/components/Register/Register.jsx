import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Register = (props) => {
    const [firstname, setFirstName] = useState()
    const [lastname, setLastName] = useState()
    const [username, setUserName] = useState()
    const [password, setPassword] = useState()
    const [email, setEmail] = useState()
    const [user, setUser] = useState()
    const navigate = useNavigate()
    let tempUser = {
        username: username,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUser(tempUser)
        try{
             await axios ({
                method: "POST",
                url: 'http://127.0.0.1:8000/api/auth/register/',
                 data: {
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    is_staff: false,
                },
            });
            console.log(user);           
            setUserName("");
            setPassword("");
            setEmail("");
            setFirstName("");
            setLastName("");
            navigate("/")
        } catch (e) {
          console.log(e)
        }
    }

    function handleOnClick() {
      navigate("/")
    }

    return ( 
        <div>
            <Form className="Register" onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>User Name</Form.Label>
                    <Form.Control onChange={e => setUserName(e.target.value)} type="text" required />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                    <Form.Control onChange={e => setPassword(e.target.value)} type="text" required />
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                    <Form.Control onChange={e => setEmail(e.target.value)} type="text" required />
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
                <Button type="submit">Submit</Button>
            </Form>
            <Button onClick={handleOnClick}>Sign In</Button>
        </div>
     );
}
 
export default Register;