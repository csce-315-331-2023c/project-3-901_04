//import React from 'react'
import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import axios from 'axios';

function Cashier() {
  const [rows, setRows] = useState({rows: null, setRows: null});
  console.log("cashier called");
  const [array, setArray] = useState([]);
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
        console.log("length: ", numItems);
        console.log("data success: ", res);
        setRows(res.data);
        for (var i = 0; i < numEntrees; i ++) {
          temparray.push(<button>{res.entrees[i].entree_name}</button>);
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

function getArray(arr) {
  <div>
    {arr.map((item) => {
      return item;
    })}
  </div>
}

export default Cashier