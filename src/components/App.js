import React, { useState, useEffect } from 'react';
import Login from './Login/Login';
import Register from './Register/Register';
import AdminPage from './AdminPage/AdminPage';
import PageNotFound from './PageNotFound/PageNotFound';
import CustomerPage from './CustomerPage/CustomerPage';
import ShoppingCartPage from './ShoppingCartPage/ShoppingCartPage';
import axios from "axios";
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
  const [productIdAndQuantity, setProductIdAndQuantity] = useState([]);
  const [counter, setCounter] = useState(0);
  const [productInfo, setProductInfo] = useState([]);
  const [budget, setBudget] = useState({});
  const [toggle, setToggle] = useState(false);
  
  useEffect(() => {
    getToken();
    getBudget();
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
            tempShoppingCart = tempShoppingCart.concat(sc);
            setShoppingCart(tempShoppingCart);
        }
    })
    console.log(shoppingCart);
    getShoppingCartCount(tempShoppingCart);
    getProductIdAndQuantity(tempShoppingCart); 
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
    setCounter(tempCounter);
    console.log(counter);
  }

  const getProductIdAndQuantity = (tempShoppingCart) => {
    const jwt = localStorage.getItem('token');
    const dced_user = jwtDecode(jwt);
    let tempProductIdAndQuantity = [];
    tempShoppingCart.filter((sc) => {
      if (sc.user === dced_user.user_id) {
        let newProductIdAndQuantity = tempProductIdAndQuantity.concat({
          productId: sc.product,
          quantity: sc.quantity
        });
        tempProductIdAndQuantity = newProductIdAndQuantity; 
      }
    })
    console.log(`ProductIdAndQuantity: ${tempProductIdAndQuantity}`);
    setProductIdAndQuantity(tempProductIdAndQuantity);
    getProductInfo(tempProductIdAndQuantity);  
  }

  const getProductInfo = (tempProductIdAndQuantity) => {
    let tempProductInfo = [];
    tempProductIdAndQuantity.map(async item => {
      await axios({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/products/' + item.productId + '/',
      }).then((response)=>{
        let newProductInfo = tempProductInfo.concat({
          product: response.data,
          quantity: item.quantity
        });
        tempProductInfo = newProductInfo;
      })
      console.log(`tempProductInfo: ${tempProductInfo}`);
      setProductInfo(tempProductInfo);
    })
  }

  const getBudget = async () => {
    var results = await axios ({
      method: 'GET',
      url: 'http://127.0.01:8000/api/budgets/' + 1 + '/',
    });
    console.log(`budget: ${results.data}`);
    setBudget(results.data);
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  const renderToggle = () => {
    setToggle(!toggle);     
  }

  const formatNumber = (number) => {
    let formattedNumber = new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: 'USD'
    }).format(number);
      return formattedNumber;
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
                productInfo={productInfo}
                shoppingCart={shoppingCart}
                productIdAndQuantity={productIdAndQuantity}
                counter={counter}
                renderToggle={renderToggle}
                getShoppingCart={getShoppingCart}
                getProductInfo={getProductInfo}
                logout={logout}
                formatNumber={formatNumber}
              /> 
              :
              <AdminPage
                budget={budget}
                getBudget={getBudget}
                renderToggle={renderToggle} 
              />
            ) 
          )
        }/>
        <Route path="/register" element={
          <Register />
        }/>
        <Route path="/shopping-cart" element={
          <ShoppingCartPage 
            productInfo={productInfo}
            shoppingCart={shoppingCart}
            budget={budget}
            renderToggle={renderToggle}
            formatNumber={formatNumber}
          />
        }/>
        <Route path="*" element={
          <PageNotFound />
        }/>
      </Routes>
    </Router>
  );    
}

export default App;
