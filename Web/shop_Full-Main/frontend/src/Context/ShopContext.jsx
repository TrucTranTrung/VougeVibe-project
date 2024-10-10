import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const [products, setProducts] = useState([]);

  const getDefaultCart = () => {
    let cart = {};
    cart[1]=0;
    return cart; 
  };

  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    fetch(`${backend_url}/allproducts/all`)
      .then((res) => res.json())
      .then((data) =>  setProducts(data));

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
        .then((resp) => resp.json())
        .then((data) => { setCartItems(data) });
    }
  }, [])

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    const keys = Object.keys(cartItems);
    keys.forEach(item => {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product._id === item);
           totalAmount += cartItems[item] * itemInfo.new_price;
        } catch (error) {}
      }
    }); 
    return totalAmount;
  };

  const getTotalCartItems = () => {
    
    let totalItem = 0;
    const keys = Object.keys(cartItems);
    keys.forEach(item => {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product._id === item);
          totalItem += itemInfo ? 1 : 0 ;
        } catch (error) {}
      }
    }); 
    return totalItem;
  };

  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please Login");
      return;
    }
    setCartItems((prev) => {
      if(prev[itemId] === undefined || prev[itemId] === null)
        return { ...prev, [itemId]: 1 }
      else
       return { ...prev, [itemId]: prev[itemId] + 1 }
    });
    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/addtocart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
    }
    alert("Add product to cart success")
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
    }
  };

  const contextValue = { products, getTotalCartItems, cartItems, addToCart, removeFromCart, getTotalCartAmount };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
