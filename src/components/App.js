import React, { useState, useEffect } from 'react';
import Login from './Login/Login';
import Register from './Register/Register';
import AdminPage from './AdminPage/AdminPage';
import CustomerPage from './CustomerPage/CustomerPage';
import axios from "axios"
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import jwtDecode from "jwt-decode";

function App() {
  const [user, setUser] = useState('');

  useEffect(() => {
    login(); 
  }, [])

  const login = async () => {
    const jwt = localStorage.getItem('token')
    const dced_user = jwtDecode(jwt)
    try {
      var results = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/auth/' + dced_user.user_id + '/',
        headers: {Authorization: `Bearer ${jwt}`},
      })
      console.log(results.data);
      setUser(results.data);
    } catch (error) {
      console.log(error);
    }
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          ((!user) ?
            <Login />
          :
            ((!user.is_staff) ?
              <CustomerPage /> 
            :
              <AdminPage />
            ) 
          )
        }
        />
        <Route path="/register" element={
            <Register />
          } 
        />
      </Routes>
    </Router>
  );    
}

export default App;
