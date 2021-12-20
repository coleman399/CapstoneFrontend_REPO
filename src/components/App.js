import React, { useState, useEffect } from 'react';
import Login from './Login/Login';
import Register from './Register/Register';
import AdminPage from './AdminPage/AdminPage';
import PageNotFound from './PageNotFound/PageNotFound';
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
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    login(); 
  }, [toggle])

  const login = async () => {
    try {
      const jwt = localStorage.getItem('token')
      const dced_user = jwtDecode(jwt)
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

  const reloadToggle = () => {
    setToggle(!toggle)     
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          ((!user)? 
            <Login /> 
            : 
            ((!user.is_staff) ?
              <CustomerPage user={user}/> 
              :
              <AdminPage />
            ) 
          )
        }/>
        <Route path="/register" element={
          <Register />
        }/>
        <Route path="*" element={
          <PageNotFound />
        }/>
      </Routes>
    </Router>
  );    
}

export default App;
