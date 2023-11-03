//import React from 'react'
import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import '@mui/material'; 
import { TextField } from '@mui/material';

function Cashier() {
  //array of all menu items
  const [array, setArray] = useState([]);
  //array containing order items
  const [order, setOrder] = useState([]);
  //array containing order items (for purpose of undo)
  const [prevOrder, setPrev] = useState([]);

  useEffect(() => {
    const temparray = [];
    const tempOrder = [];
    const getData = async () => {
      try {
        const backendURL = process.env.NODE_ENV === 'production'
          ? 'https://project-3-901-04.vercel.app/api/menu'
          : 'http://localhost:3001/api/menu';
        const response = await fetch(backendURL);
        const res = await response.json();
        const numItems = await (Object.keys(res.entrees).length + Object.keys(res.drinks).length);
        const numEntrees = await (Object.keys(res.entrees).length);
        const numDrinks = await (Object.keys(res.drinks).length);
        console.log("length: ", numItems);
        console.log("data success: ", res);
        for (var i = 0; i < numEntrees; i ++) {
          const tempName = res.entrees[i].entree_name;
          temparray.push(<button onClick={function itemPress() {
            console.log(tempName);
            setPrev(order);
            setOrder(array => [...array, tempName + '\n'] );
          }}>{res.entrees[i].entree_name}</button>);
          console.log("pushed: ", temparray[i]);
        }
        for (var i = 0; i < numDrinks; i ++) {
          const tempName = res.drinks[i].drink_name;
          temparray.push(<button onClick={function itemPress() {
            console.log(tempName);
            setPrev(order);
            setOrder(array => [...array, tempName + '\n'] );
          }}>{res.drinks[i].drink_name}</button>);
          console.log("pushed: ", temparray[i]);
        }
        setArray(temparray);
        console.log("length after", temparray.length);
      }
      catch(e) {
        console.log(e);
      }
    };
    getData();
  },[]);
  
  return (
    <div>
        {(array.length > 0) ? (
            <div>
              {array}
              <TextField
                disabled
                id="outlined-multiline-flexible"
                multiline
                //defaultvalue="Ordered items will show up here"
                value={order}
                label="Order"
                helperText="Total: "
                onChange={order}
              />
            </div>
        ): (
            <h>loading...</h>
        )}
    </div>
)
}


export default Cashier