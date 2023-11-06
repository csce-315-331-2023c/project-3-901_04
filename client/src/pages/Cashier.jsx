//import React from 'react'
import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import '@mui/material'; 
import { TextField } from '@mui/material';
import {Grid} from '@mui/material';

function Cashier() {
  //array of all menu items
  const [array, setArray] = useState([]);
  //array containing order items
  const [order, setOrder] = useState([]);
  //array containing order prices
  const [orderPrices, setOrderP] = useState([]);

  //gets the menu contents just once and sets up all menu item buttons and their functions.
  useEffect(() => {
    const temparray = [];
    const getData = async () => {
      try {
        const backendURL = process.env.NODE_ENV === 'production'
          ? 'https://project-3-901-04.vercel.app/api/menu'
          : 'http://localhost:3001/api/menu';
        const response = await fetch(backendURL);
        const res = await response.json();
        const numItems = (Object.keys(res.entrees).length + Object.keys(res.drinks).length);
        const numEntrees = (Object.keys(res.entrees).length);
        const numDrinks = (Object.keys(res.drinks).length);
        console.log("length: ", numItems);
        console.log("data success: ", res);
        for (var i = 0; i < numEntrees; i ++) {
          const tempName = res.entrees[i].entree_name;
          const tempPrice = parseFloat(res.entrees[i].price);
          temparray.push(<button onClick={function itemPress() {
            console.log(tempName);
            setOrder(order => [...order, tempName] );
            setOrderP(orderPrices => [...orderPrices, tempPrice]);
          }}>{res.entrees[i].entree_name}</button>);
          console.log("pushed: ", temparray[i]);
        }
        for (var i = 0; i < numDrinks; i ++) {
          const tempName = res.drinks[i].drink_name;
          const tempPrice = res.drinks[i].price;
          temparray.push(<button onClick={function itemPress() {
            console.log(tempName);
            setOrder(order => [...order, tempName] );
            setOrderP(orderPrices => [...orderPrices, tempPrice]);
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

              <Grid container spacing={0.5}>
              {/*All menu item buttons*/}
                <Grid item xs={8}>
                  <>{array}</>
                </Grid>

                {/*Textbox for viewing current order TODO need to mess with disabled state*/}
                <Grid item xs container spacing = {0}>
                  {/*The names of ordered items*/}
                  <TextField
                    fullwidth
                    disabled
                    id="outlined-multiline-flexible"
                    multiline
                    //defaultvalue="Ordered items will show up here"
                    value={order.join("\n")}
                    label="Order"
                    onChange={order}
                    //maxRows = {order.length}
                  />

                  {/*The prices of ordered items*/}
                  <TextField
                    fullwidth
                    disabled
                    id="outlined-multiline-flexible"
                    multiline
                    //defaultvalue="Ordered items will show up here"
                    value={orderPrices.join("\n")}
                    label="Price"
                    helperText={"Total: " + orderPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
                    onChange={orderPrices}
                  />

                  <Grid item xs>
                    <button onClick={function removeOne() {
                        console.log('Remove one called');
                        setOrder(order => [...order.slice(0,-1)] );
                        setOrderP(orderPrices => [...orderPrices.slice(0,-1)] );
                    }}>Remove Last Item</button>

                    <button onClick={function clearAll() {
                        console.log('Clear all called');
                        setOrder([]);
                        setOrderP([]);
                    }}>Clear All</button>

                    {/*TODO need to implement SQL*/}
                    <button onClick={function submit() {
                        console.log('Place order called');
                    }}>Place Order</button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
        ): (
            <h>loading...</h>
        )}
    </div>
)
}

export default Cashier