//import React from 'react'
import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';

/**
 * This function sets up the Cashier page's HTML.
 * It populates the page with buttons of menu items. 
 * @returns HTML
 */
function Cashier() {
  const [rows, setRows] = useState({rows: null, setRows: null});
  //stores the menu item buttons
  const [array, setArray] = useState([]);

  useEffect(() => {
    //this is necessary; otherwise changes to array will be erased after useEffect().
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
        setRows(res.data);
        for (var i = 0; i < numEntrees; i ++) {
          const tempName = res.entrees[i].entree_name;
          temparray.push(<button onClick={function buttonPress() {
            console.log(tempName);
          }}>{res.entrees[i].entree_name}</button>);
          //console.log("pushed: ", temparray[i]);
        }
        for (var i = 0; i < numDrinks; i ++) {
          const tempName = res.drinks[i].drink_name;
          temparray.push(<button onClick={function buttonPress() {
            console.log(tempName);
          }}>{res.drinks[i].drink_name}</button>);
          //console.log("pushed: ", temparray[i]);
        }
        //necessary, or else array will not be changed.
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