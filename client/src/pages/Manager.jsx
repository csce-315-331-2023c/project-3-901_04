import React, { useEffect, useState } from 'react';
import '../styles/Manager.css';
import Button from '@mui/material/Button';
import { TextField, Grid } from '@mui/material';
import axios from 'axios';

function Manager() {
  
  const [DBItems, setDBItems] = useState({ menuItems: [], inventoryItems: [] });
  const [activeView, setActiveView] = useState(DBItems.menuItems);

  const [menuItemRecipe, setRecipe] = useState([]);
  const [displayedRecipe, setDisplayedRecipe] = useState([]);

  const [activeGrid, setActiveGrid] = useState(2);

  const [menuItemName, setMenuItemName] = useState('Select a Menu Item');
  let menuItemPrice;
  let menuItemTogo;
  
  let invItemName;
  let invItemStock;
  let invItemCost;

  const [showingMenu, setShowingMenu] = useState(true);

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
    handleViewToggle();
  }, []);

  useEffect(() => {
    console.log('Updated menuItemRecipe:', menuItemRecipe);

    const updatedDisplay = menuItemRecipe.map((item) => ({
      name: item.item_name,
      quantity: item.quantity,
    }));
    
    setDisplayedRecipe(updatedDisplay);

  }, [menuItemRecipe]);

  function handleItemButtonClick(buttonText) {
    console.log('Button clicked: ', buttonText);
    const backendURL2 = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/api/recipe'
    : 'http://localhost:3001/api/recipe';
    const fetchRecipeData = async () => {
      try {
        const recipeQuery = await axios.get(backendURL2, {
          params: {
            requestedItem: buttonText,
          },
        });
        console.log(recipeQuery.data.recipe);
        setRecipe(recipeQuery.data.recipe);
      } catch (error) {
        console.error('Recipe error', error);
      }
    };
    fetchRecipeData();
  }  

  const inventoryDataDisplay = () => {
    return (
      <Grid container spacing={2}>
            <Grid item xs={6}>
              <h3>Name</h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <h3>Stock</h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <h3>Cost</h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <h3>Minimum Stock Warning</h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
          </Grid>
    );
  };

  const menuDataDisplay = () => {
    return (
      <Grid container spacing={2}>
            <Grid item xs={6} className="editPaneItem">
              <h3>Name</h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
            <Grid item xs={6} className="editPaneItem">
              <h3>Price</h3>
            <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
            <Grid item xs={6} className="editPaneItem">
              <h3>To-Go</h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Select an item to update"
              >
              </TextField>
            </Grid>
          </Grid>
    );
  };

  const handleViewToggle = () => {
    setActiveGrid(activeGrid === 1 ? 2 : 1);
    setActiveView(activeView === DBItems.menuItems ? DBItems.inventoryItems : DBItems.menuItems);
    setShowingMenu(!showingMenu);
    setRecipe( [{ item_name: 'Select a menu item to update', quantity: 0}] );
  };

  const dataGridContainer = () => {
    return (
      <div>
        {activeGrid === 1 && inventoryDataDisplay()}
        {activeGrid === 2 && menuDataDisplay()}
      </div>
    );
  };

  const ManagerNavButtons = ({ items }) => {
    return (
      <div className="scrollView" style={{ height: '600px', overflowY: 'scroll' }}>
        <div>
          {items.map((item) => (
            <Button onClick={() => handleItemButtonClick(item.item_name)} variant="outlined" className="managerMenuButton" key={item}>
              {item.item_name}
            </Button>
          ))}
        </div>
      </div>
      
    );
  };

  console.log("showingMenu: ", showingMenu);
  if(showingMenu){
    return (
      <div className='manager'>
        <Grid container spacing={2}>
          
          <Grid item xs={3.6}>
            <div className='leftGrid'>
              <div className='scrollView'>
                <div>
                  <Button className="managerMenuSwapButton" variant="contained" disableElevation onClick={handleViewToggle}>
                    Swap Menu/Inventory
                  </Button>
                </div>
                <ManagerNavButtons items={activeView}/>
              </div>
            </div>
          </Grid>
          
          <Grid item xs={5.4}>
            <div className='.editPane'>{dataGridContainer()}</div>
          </Grid>

          <Grid item xs={3}>
            <div className='rightGrid'>
              <div className='scrollView'>
                <div>
                  <h1>Recipe</h1>
                </div>
                <div className="scrollView" style={{ height: '600px', overflowY: 'scroll' }}>
                  <div>
                  {
                    displayedRecipe && displayedRecipe.map((item, index) => (
                    <p key={index}>
                      {item.name}: <b>{item.quantity}</b>
                    </p>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </Grid>

        </Grid>

      </div>
    )
  }
  else{
    return (
      <div className='manager'>
        <Grid container spacing={2}>
          
          <Grid item xs={3.6}>
            <div className='leftGrid'>
              <div className='scrollView'>
                <div>
                  <Button className="managerMenuSwapButton" variant="contained" disableElevation onClick={handleViewToggle}>
                    Swap Menu/Inventory
                  </Button>
                </div>
                <ManagerNavButtons items={activeView}/>
              </div>
            </div>
          </Grid>
          
          <Grid item xs={5.4}>
            <div className='.editPane'>{dataGridContainer()}</div>
          </Grid>

          <Grid item xs={3}>
          </Grid>

        </Grid>

      </div>
    )
  }
}

export default Manager