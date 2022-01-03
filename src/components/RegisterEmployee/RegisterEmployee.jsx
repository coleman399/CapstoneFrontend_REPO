import React, { useState } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import './RegisterEmployee.css';

const RegisterEmployee = (props) => {
  const [firstname, setFirstName] = useState()
  const [lastname, setLastName] = useState()
  const [employeeId, setEmployeeId] = useState()
  const [password, setPassword] = useState("tempPassword1")
  const [salary, setSalary] = useState()
  const [email, setEmail] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const [update, setUpdate] = useState(false)
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
    const jwt = localStorage.getItem('token');
    if (update === false) {
      try {
        let cost = parseFloat(props.budget.total_expenses) + parseFloat(tempUser.salary);
        let total_cost = (cost).toFixed(2);
        let profit = parseFloat(props.budget.total_profit) - parseFloat(tempUser.salary);
        let total_profit = profit.toFixed(2);
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
            salary: tempUser.salary,
            spent: 0.00,
            userPassword: tempUser.password,
          },
        }).then((response)=>{
            console.log(`employee: ${response.data}`);
        })
        await axios ({
          method: "POST",
          url: 'http://127.0.01:8000/api/budgets/',
            data: {
                total_sales: props.budget.total_sales,
                total_expenses: total_cost,
                total_profit: total_profit,
            }
        }).then((response)=>{
            console.log(`budget: ${response.data}`);
        })
        alert("🎉 Employee Registered! 🎉")           
        let form = document.getElementById('register-employee-form');
        form.reset()
        props.renderToggle();  
      } catch (e) {
        if (e.response.status === 401) {
          alert("Unauthorized access. Please try again.")
          let form = document.getElementById('register-employee-form');
          form.reset()  
        } else if (e.response.status === 400) {
          let newMessage = JSON.stringify(e.response.data)
          alert("😱\n" + " " + newMessage)
          let form = document.getElementById('register-employee-form');
          form.reset()  
        } else {
          console.log(e)
          alert("Oops... Something went wrong. 😥")
          let form = document.getElementById('register-employee-form');
          form.reset()  
        }
      }
    } else {
      try {
        let id;
        let post_salary;
        let temp_spent;
        props.users.forEach(user => {
          if(user.employee_id === tempUser.employeeId) {
            id = user.id;
            post_salary = user.salary;
            temp_spent = user.spent;
          }
        })
        await axios ({
          method: "DELETE",
          url: 'http://127.0.0.1:8000/api/auth/' + id + "/",
          headers: {Authorization: `Bearer ${jwt}`},
        }).then(response => {
          console.log(response.data)
        })
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
            salary: tempUser.salary,
            spent: temp_spent,
            userPassword: tempUser.password,
          },
        }).then(response => {
          console.log(response.data)
        });
        let prev_expenses = parseFloat(props.budget.total_expenses) - parseFloat(post_salary)
        let expenses = (prev_expenses).toFixed(2);
        let post_expenses = parseFloat(expenses) + parseFloat(tempUser.salary);
        let total_cost = post_expenses.toFixed(2);
        let prev_profit = parseFloat(props.budget.total_profit) + parseFloat(post_salary)
        let profit = (prev_profit).toFixed(2);
        let post_profit = parseFloat(profit) - parseFloat(tempUser.salary);
        let total_profit = post_profit.toFixed(2);
        await axios ({
          method: "POST",
          url: 'http://127.0.01:8000/api/budgets/',
            data: {
                total_sales: props.budget.total_sales,
                total_expenses: total_cost,
                total_profit: total_profit,
            }
        }).then((response)=>{
            console.log(`budget: ${response.data}`);
        })
        alert("🎉 Employee Updated! 🎉") 
        let form = document.getElementById('register-employee-form');
        form.reset()  
      } catch (e) {
        if (e.response.status === 401) {
          alert("Unauthorized access. Please try again.")
          let form = document.getElementById('register-employee-form');
          form.reset()  
        } else if (e.response.status === 400) {
          let newMessage = JSON.stringify(e.response.data)
          alert("😱\n" + " " + newMessage)
          let form = document.getElementById('register-employee-form');
          form.reset()  
        } else {
          console.log(e)
          alert("Oops... Something went wrong. 😥")
          let form = document.getElementById('register-employee-form');
          form.reset()  
        }
      }
    }
  }

  return ( 
    <div>
      <Container>
        {props.editEmployee === true ?
          <Row>
            <Col>
              <div className="p-5 border rounded bg-white">
                <h4 className="text-center">Register Employee</h4>
                <br/>
                <Form className="register-employee-form" id="register-employee-form" onSubmit={handleSubmit}>
                    <Form.Group controlId="employeeId">
                      <Form.Label>Employee Id</Form.Label>
                        <Form.Control onChange={e => setEmployeeId(e.target.value)} placeholder={props.editThisEmployee.employee_id} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Temp Password</Form.Label>
                        <Form.Control type="text" placeholder="tempPassword1" disabled/>
                    </Form.Group>  
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} placeholder={props.editThisEmployee.email} type="email" required />
                    </Form.Group>
                    <Form.Group controlId="firstname">
                      <Form.Label>First Name</Form.Label>
                        <Form.Control onChange={e => setFirstName(e.target.value)} placeholder={props.editThisEmployee.first_name} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="lastname">
                      <Form.Label>Last Name</Form.Label>
                        <Form.Control onChange={e => setLastName(e.target.value)} placeholder={props.editThisEmployee.last_name} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="salary">
                      <Form.Label>Salary</Form.Label>
                        <Form.Control onChange={e => setSalary(e.target.value)} placeholder={props.editThisEmployee.salary}type="text" required />
                    </Form.Group>
                    <Form.Group controlId="isAdmin">
                        <Form.Check type="switch" label="Admin" as="input" onChange={e => props.setIsAdmin(!isAdmin)} checked={props.editThisEmployee.is_staff}/>  
                    </Form.Group>
                    <Form.Group controlId="UpdateEmployee">
                      <Form.Check type="switch" label="Update" as="input" onChange={e => props.setEditEmployee(!props.editEmployee)} checked={props.editEmployee}/>
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                      <Button type="submit">Submit</Button>
                    </div>
                </Form>
              </div>
            </Col>
          </Row>
        :
          <Row>
            <Col>
              <div className="p-5 border rounded bg-white">
                <h4 className="text-center">Register Employee</h4>
                <br/>
                <Form className="register-employee-form" id="register-employee-form" onSubmit={handleSubmit}>
                    <Form.Group controlId="employeeId">
                      <Form.Label>Employee Id</Form.Label>
                        <Form.Control onChange={e => setEmployeeId(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Temp Password</Form.Label>
                        <Form.Control type="text" placeholder="tempPassword1" disabled/>
                    </Form.Group>  
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} type="email" required />
                    </Form.Group>
                    <Form.Group controlId="firstname">
                      <Form.Label>First Name</Form.Label>
                        <Form.Control onChange={e => setFirstName(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="lastname">
                      <Form.Label>Last Name</Form.Label>
                        <Form.Control onChange={e => setLastName(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="salary">
                      <Form.Label>Salary</Form.Label>
                        <Form.Control onChange={e => setSalary(e.target.value)} type="text" required />
                    </Form.Group>
                    <Form.Group controlId="isAdmin">
                      <Form.Check type="switch" label="Admin" as="input" onChange={e => setIsAdmin(!isAdmin)}/>
                    </Form.Group>
                    <Form.Group controlId="UpdateEmployee">
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
        }
      </Container>
    </div>
  );
}
 
export default RegisterEmployee;