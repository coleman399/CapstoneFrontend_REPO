import React, { useState, useEffect } from 'react';
import Login from './Login/Login';
import AdminPage from './AdminPage/AdminPage';
import PageNotFound from './PageNotFound/PageNotFound';
import CustomerPage from './CustomerPage/CustomerPage';
import ShoppingCartPage from './ShoppingCartPage/ShoppingCartPage';
import UpdatePassword from './UpdatePassword/UpdatePassword';
import axios from "axios";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import jwtDecode from "jwt-decode";

function App() {
  const [user, setUser] = useState('');
  const [users, setUsers] = useState({})
  const [employeeId, setEmployeeId] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [products, setProducts] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [productIdAndQuantity, setProductIdAndQuantity] = useState([]);
  const [counter, setCounter] = useState(0);
  const [productInfo, setProductInfo] = useState([]);
  const [budget, setBudget] = useState({});
  const [budgets, setBudgets] = useState({});
  const [toggle, setToggle] = useState(false);
  const [totalSales, setTotalSales] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState([]);
  const [totalProfit, setTotalProfit] = useState([]);
  
  useEffect(() => {
    getToken();
  }, [toggle])

  const getToken = () => {
    try {  
      const jwt = localStorage.getItem('token');
      const dced_user = jwtDecode(jwt);
      login(jwt, dced_user);
    } catch (error) {
      console.log(error);
    }  
  }

  const login = async (jwt, dced_user) => {
    try {
      var results = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/auth/' + dced_user.employee_id + '/',
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
        if (sc.user === dced_user.employee_id) {
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
      if (sc.user === dced_user.employee_id) {
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
      if (sc.user === dced_user.employee_id) {
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
    getBudgets();
    getUsers();
  }

  const getBudgets = async () => {
    var results = await axios ({
      method: 'GET',
      url: 'http://127.0.01:8000/api/budgets/',
    });
    console.log(`budget: ${results.data}`);
    if (results.data.length === 0) {
      setBudget({
        total_sales: 0,
        total_expenses: 0,
        total_profit: 0
      })
    } else {
      setBudget(results.data[results.data.length-1])
    }
    setBudgets(results.data);
    getTotalSales(results.data);
  }

  const getTotalSales = (allBudgets) => {
    let tempTotalSales = [];
    allBudgets.map(budget => {
        let newTotalSales = tempTotalSales.concat({
            x: budget.date, 
            y: budget.total_sales
        });
        tempTotalSales = newTotalSales;
    });
    console.log(`tempTotalSales: ${tempTotalSales}`);
    setTotalSales(tempTotalSales);
    getTotalExpenses(allBudgets);
  }

  const getTotalExpenses = (allBudgets) => {
    let tempTotalExpenses = [];
    allBudgets.map(budget => {
        let newTotalExpenses = tempTotalExpenses.concat({
            x: budget.date, 
            y: budget.total_expenses
        });
        tempTotalExpenses = newTotalExpenses;
    });
    console.log(`tempTotalExpenses: ${tempTotalExpenses}`);
    setTotalExpenses(tempTotalExpenses);
    getTotalProfit(allBudgets);
  }

  const getTotalProfit = (allBudgets) => {
    let tempTotalProfit = [];
    allBudgets.map(budget => {
        let newTotalProfit = tempTotalProfit.concat({
            x: budget.date, 
            y: budget.total_profit
        });
        tempTotalProfit = newTotalProfit;
    });
    console.log(`tempTotalProfit: ${tempTotalProfit}`);
    setTotalProfit(tempTotalProfit);
  }

  const getUsers = async () => {
    const jwt = localStorage.getItem('token');
    var results = await axios ({
      method: 'GET',
      url: 'http://127.0.01:8000/api/auth/',
      headers: {Authorization: `Bearer ${jwt}`},
    });
    console.log(`users: ${results.data}`);
    setUsers(results.data);
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

  const truncate = (string) => {
    return string.length > 8 ? string.substring(0, 7) + "..." : string;
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          ((!user)? 
            <Login 
              employeeId={employeeId}
              userPassword={userPassword}
              setEmployeeId={setEmployeeId}
              setUserPassword={setUserPassword}
              login={login}
            /> 
            : 
            ((!user.is_staff) ?
              <CustomerPage 
                user={user} 
                counter={counter}
                products={products}
                productInfo={productInfo}
                shoppingCart={shoppingCart}
                productIdAndQuantity={productIdAndQuantity}
                logout={logout}
                formatNumber={formatNumber}
                renderToggle={renderToggle}
                getProductInfo={getProductInfo}
                getShoppingCart={getShoppingCart}
              /> 
              :
              <AdminPage
                users={users}
                budget={budget}
                budgets={budgets}
                products={products}
                totalSales={totalSales}
                totalExpenses={totalExpenses}
                totalProfit={totalProfit}
                logout={logout}
                getBudgets={getBudgets}
                renderToggle={renderToggle}
                formatNumber={formatNumber}
                truncate={truncate} 
              />
            ) 
          )
        }/>
        <Route path="/shopping-cart" element={
          <ShoppingCartPage 
            user={user}
            budget={budget}
            productInfo={productInfo}
            shoppingCart={shoppingCart}
            userPassword={userPassword}
            renderToggle={renderToggle}
            formatNumber={formatNumber}
            setUserPassword={setUserPassword}
          />
        }/>
        <Route path="/update-password" element={
          <UpdatePassword
            user={user} 
            userPassword={userPassword}
            setUserPassword={setUserPassword}
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
