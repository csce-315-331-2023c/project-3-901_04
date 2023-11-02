//import React from 'react'
import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import axios from 'axios';


function Cashier() {
  const [rows, setRows] = useState({rows: null, setRows: null});
  console.log("cashier called");

  useEffect(() => {
    axios.get('/api')
      .then(res => {
        setRows(res.data);
        console.log(res.data);
      }).catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <div className='cashier'>
      <div>Cashier</div>
    </div>

  )
}

export default Cashier