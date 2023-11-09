import React, { useEffect, useState } from 'react'
import '../styles/Manager.css'
import Button from '@mui/material/Button';
import { TextField, Grid } from '@mui/material';
import ManagerNavButtons from '../components/ManagerNavButtons'


function Manager() {
  
  
  const [DBItems, setDBItems] = useState({ menuItems: [], inventoryItems: [] });
  const [activeView, setActiveView] = useState(DBItems.menuItems);

  useEffect(() => {
    const backendURL = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/api/managerMenu'
      : 'http://localhost:3001/api/managerMenu';
    fetch(backendURL) //backend url
      .then(res => res.json())
      .then(data => {
        setDBItems(data);
        setActiveView(DBItems.menuItems);
        console.log(data);
      });
      
  }, []);

  console.log(DBItems);
  console.log('ACTIVEVIEW: ', activeView);
  
  const toggleList = () => {
    setActiveView(activeView === DBItems.menuItems ? DBItems.inventoryItems : DBItems.menuItems);
  };

  return (
    <div className='manager'>
      <Grid container spacing={2}>
        
        <Grid item xs={3.6}>
          <div className='leftGrid'>
            <div className='scrollView'>
              <div>
                <Button className="managerMenuSwapButton" variant="contained" disableElevation onClick={toggleList}>Swap Menu/Inventory</Button>
              </div>
              <ManagerNavButtons items={activeView}/>
            </div>
          </div>
        </Grid>
        
        <Grid item xs={8.4}>

        </Grid>
      </Grid>

    </div>
  )
  

}

export default Manager