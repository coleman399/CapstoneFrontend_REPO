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
  const [decodedToken, setDecodedToken] = useState();
  const [products, setProducts] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [counter, setCounter] = useState(0);
  const [product, setProduct] = useState('');
  
  const [toggle, setToggle] = useState(false);
  
  useEffect(() => {
    getToken();
  }, [toggle])

  const getToken = () => {
    try {  
      const jwt = localStorage.getItem('token');
      const dced_user = jwtDecode(jwt);
      setDecodedToken(dced_user);
      login(jwt, dced_user);
    } catch (error) {
      console.log(error);
    }  
  }

  const login = async (jwt, dced_user) => {
    try {
      var results = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/auth/' + dced_user.user_id + '/',
        headers: {Authorization: `Bearer ${jwt}`},
      })
      console.log(results.data);
      getProducts();
      setUser(results.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getProducts = async () => {
    var results = await axios ({
          method: 'GET',
          url: 'http://127.0.01:8000/api/products/'
    });
    console.log(results.data);
    setProducts(results.data);
    getShoppingCart();
  }

  //add try-catch
  const getShoppingCart = async () => {
    await axios ({
        method: 'GET',
        url: 'http://127.0.01:8000/api/shoppingcarts/'
    }).then((response) =>{
        console.log(response.data);
        filterShoppingCarts(response.data);
    })
  }

  const filterShoppingCarts = (allShoppingCarts) => {
    const jwt = localStorage.getItem('token');
    const dced_user = jwtDecode(jwt);
    let tempShoppingCart = [];
    allShoppingCarts.filter((sc)=> {
        if (sc.user === dced_user.user_id) {
            tempShoppingCart = tempShoppingCart.concat(sc)
            setShoppingCart(tempShoppingCart);
        }
    })
    console.log(shoppingCart);
    getShoppingCartCount(tempShoppingCart);
    getProductIds(tempShoppingCart); 
  }

  const getShoppingCartCount = (tempShoppingCart) => {
    const jwt = localStorage.getItem('token');
    const dced_user = jwtDecode(jwt);
    let tempCounter = 0;
    tempShoppingCart.filter((sc) => { 
      if (sc.user === dced_user.user_id) {
      tempCounter = tempCounter + sc.quantity;
      }
    })
    setCounter(tempCounter)
    console.log(counter);
  }

  const getProductIds = (tempShoppingCart) => {
    const jwt = localStorage.getItem('token');
    const dced_user = jwtDecode(jwt);
    let array = [];
    tempShoppingCart.filter((sc) => {
      if (sc.user === dced_user.user_id) {
        let newProductIds = array.concat(sc.product);
        array = newProductIds;
        setProductIds(array);
      }
    })
    console.log(productIds);  
  }

  const getProduct = async (productId) => {
    await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/products/' + productId + '/',
    }).then((response)=>{
      setProduct(response.data)
      console.log(response.data)
    })
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  const renderToggle = () => {
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
              <CustomerPage 
                user={user} 
                decodedToken={decodedToken} 
                products={products}
                product={product}
                shoppingCart={shoppingCart}
                productIds={productIds}
                counter={counter}
                renderToggle={renderToggle}
                getShoppingCart={getShoppingCart}
                getProduct={getProduct}
              /> 
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
