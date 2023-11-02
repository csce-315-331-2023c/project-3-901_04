//import React from 'react'
import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import axios from 'axios';

function Cashier() {
  const [rows, setRows] = useState({rows: null, setRows: null});
  console.log("cashier called");
  const [array, setArray] = useState([]);

  const buttonPress = () => {
    console.log("button");
  };

  useEffect(() => {
    const temparray = [];
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
        setRows(res.data);
        for (var i = 0; i < numEntrees; i ++) {
          const tempName = res.entrees[i].entree_name;
          temparray.push(<button onClick={function buttonPress() {
            console.log(tempName);
          }}>{res.entrees[i].entree_name}</button>);
          console.log("pushed: ", temparray[i]);
        }
        for (var i = 0; i < numDrinks; i ++) {
          const tempName = res.drinks[i].drink_name;
          temparray.push(<button onClick={function buttonPress() {
            console.log(tempName);
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
            </div>
        ): (
            <h>loading...</h>
        )}
    </div>
)
}


export default Cashier