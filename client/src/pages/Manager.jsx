import React, { useEffect, useState } from 'react';
import '../styles/Manager.css';
import Button from '@mui/material/Button';
import { TextField, Grid } from '@mui/material';
import axios from 'axios';
import Greeting from '../components/Greeting';

function Manager() {
  
  const [DBItems, setDBItems] = useState({ menuItems: [], inventoryItems: [] });
  const [activeView, setActiveView] = useState(DBItems.menuItems);

  const [menuItemRecipe, setRecipe] = useState([]);
  const [displayedRecipe, setDisplayedRecipe] = useState([]);

  const [activeGrid, setActiveGrid] = useState(2);

  const [menuItemName, setMenuItemName] = useState('Select a Menu Item');
  const [displayedMenuItemName, setDisplayedMenuItemName] = useState();

  const [menuItemPrice, setMenuItemPrice] = useState('Select a Menu Item');
  const [displayedMenuItemPrice, setDisplayedMenuItemPrice] = useState();

  const [menuItemTogo, setMenuitemTogo] = useState('Select a Menu Item');
  const [displayedMenuItemTogo, setDisplayedMenuitemTogo] = useState();

  const [menuItemAlcoholic, setMenuitemAlcohol] = useState('Select a Menu Item');
  const [menuItemHHBeer, setMenuitemHHBeer] = useState('Select a Menu Item');
  const [menuItemHHWine, setMenuitemHHWine] = useState('Select a Menu Item');
  const [menuItemCocktail, setMenuitemCocktail] = useState('Select a Menu Item');
  const [menuItemBrunch, setMenuitemBrunch] = useState('Select a Menu Item');
  const [menuItemAttributes, setMenuItemAttributes] = useState('Select a Menu Item');
  
  const [invItemName, setInvItemName] = useState('Select an Inventory Item');
  const [displayedInvItemName, setDisplayedInvItemName] = useState();

  const [invItemStock, setInvItemStock] = useState('Select an Inventory Item');
  const [displayedInvItemStock, setDisplayedInvItemStock] = useState();

  const [invItemCost, setInvItemCost] = useState('Select an Inventory Item');
  const [displayedInvItemCost, setDisplayedInvItemCost] = useState();

  const [invItemMinimum, setinvItemMinimum] = useState('Select an Inventory Item');
  const [displayedInvItemMinimum, setDisplayedinvItemMinimum] = useState();


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

  useEffect(() => {
    console.log("Updated menuItemName: ", menuItemName);
    console.log("Updated menuItemPrice: ", menuItemPrice);
    console.log("Updated menuItemTogo: ", menuItemTogo);
    console.log("Updated invItemName: ", invItemName);
    console.log("Updated invItemStock: ", invItemStock);
    console.log("Updated invItemCost: ", invItemCost);
    console.log("Updated invItemMinimum: ", invItemMinimum);

    setDisplayedMenuItemName(menuItemName);
    setDisplayedMenuItemPrice(menuItemPrice);
    if(menuItemTogo){
      setDisplayedMenuitemTogo('☑');
    }
    else{
      setDisplayedMenuitemTogo('☒');
    }
    setDisplayedInvItemName(invItemName);
    setDisplayedInvItemStock(invItemStock);
    setDisplayedInvItemCost(invItemCost);
    setDisplayedinvItemMinimum(invItemMinimum);

    setMenuItemAttributes((prevAttributes) => ({
      ...prevAttributes,
      [menuItemName]: {
        togo: menuItemTogo,
        alcohol: menuItemAlcoholic,
        happyBeer: menuItemHHBeer,
        happyWine: menuItemHHWine,
        cocktail: menuItemCocktail,
        brunch: menuItemBrunch
      },
    }));

  }, [menuItemName, menuItemPrice, menuItemTogo, menuItemAlcoholic, menuItemHHBeer, menuItemHHWine, menuItemCocktail, menuItemBrunch, invItemName, invItemStock, invItemCost, invItemMinimum]);

  function handleItemButtonClick(buttonText) {
    console.log('Button clicked: ', buttonText);
    const backendURL2 = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/api/recipe'
    : 'http://localhost:3001/api/recipe';
    const fetchRecipeData = async () => {
      try {
        const itemQuery = await axios.get(backendURL2, {
          params: {
            requestedItem: buttonText,
          },
        });

        setRecipe(itemQuery.data.recipe);
        setMenuItemName(itemQuery.data.menuItemInfo[0].item_name);
        setMenuItemPrice(itemQuery.data.menuItemInfo[0].price);
        setMenuitemTogo(itemQuery.data.menuItemInfo[0].togo);
        
        setMenuitemAlcohol(itemQuery.data.menuItemInfo[0].alcoholic);
        setMenuitemHHBeer(itemQuery.data.menuItemInfo[0].HHbeer);
        setMenuitemHHWine(itemQuery.data.menuItemInfo[0].HHwine);
        setMenuitemCocktail(itemQuery.data.menuItemInfo[0].cocktail);
        setMenuitemBrunch(itemQuery.data.menuItemInfo[0].brunch);
        
        setInvItemName(itemQuery.data.invItemInfo[0].item_name);
        setInvItemStock(itemQuery.data.invItemInfo[0].stock);
        setInvItemCost(itemQuery.data.invItemInfo[0].cost);
        setinvItemMinimum(itemQuery.data.invItemInfo[0].min_stock_warning);

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
              <h3>Name: <div className="displayedValue">{displayedInvItemName}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Input New Name"
              >
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <h3>Stock: <div className="displayedValue">{displayedInvItemStock}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Input New Stock"
              >
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <h3>Cost: <div className="displayedValue">${displayedInvItemCost}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Input New Cost"
              >
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <h3>Minimum Stock Warning: <div className="displayedValue">{displayedInvItemMinimum}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Input New MSW"
              >
              </TextField>
            </Grid>
          </Grid>
    );
  };

  const menuDataDisplay = () => {
    //const isChecked = menuItemTogo;
    const isChecked1 = menuItemAttributes[menuItemName]?.togo || false;
    const isChecked2 = menuItemAttributes[menuItemName]?.alcoholic || false;
    const isChecked3 = menuItemAttributes[menuItemName]?.HHbeer || false;
    const isChecked4 = menuItemAttributes[menuItemName]?.HHwine || false;
    const isChecked5 = menuItemAttributes[menuItemName]?.cocktail || false;
    const isChecked6 = menuItemAttributes[menuItemName]?.brunch || false;

    return (
      <Grid container spacing={2}>
            <Grid item xs={6} className="editPaneItem">
              <h3>Name: <div className="displayedValue">{displayedMenuItemName}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              onChange={(e) => setMenuItemName(e.target.value)}
              placeholder="Input New Name"
              >
              </TextField>
            </Grid>
            <Grid item xs={6} className="editPaneItem">
              <h3>Price: <div className="displayedValue">${displayedMenuItemPrice}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              onChange={(e) => setMenuItemPrice(e.target.value)}
              placeholder="Input New Price"
              >
              </TextField>
            </Grid>
            <Grid item xs={12} className="editPaneItem">
              {/* <h3>Attributes: <div className="displayedValue">{displayedMenuItemTogo}</div></h3> */}
              <h3>Attributes: <div className="displayedValue"></div></h3>
              
              <input type="checkbox" id="features" name="options" value="ToGo" checked={isChecked1}
              onChange={() => {
                setMenuItemAttributes((prevAttributes) => ({
                ...prevAttributes,
                [menuItemName]: {
                  ...prevAttributes[menuItemName],
                  togo: !isChecked1,
                },
              }));
              }}/>To-Go
              <input type="checkbox" id="features" name="options" value="Alcohol" checked={isChecked2}
              onChange={() => {
                setMenuItemAttributes((prevAttributes) => ({
                ...prevAttributes,
                [menuItemName]: {
                  ...prevAttributes[menuItemName],
                  alcohol: !isChecked2,
                },
              }));
              }}/>Alcoholic
              <input type="checkbox" id="features" name="options" value="HappyBeer" checked={isChecked3}
              onChange={() => {
                setMenuItemAttributes((prevAttributes) => ({
                ...prevAttributes,
                [menuItemName]: {
                  ...prevAttributes[menuItemName],
                  happyBeer: !isChecked3,
                },
              }));
              }}/>Happy Hour Beer
              <input type="checkbox" id="features" name="options" value="HappyWine" checked={isChecked4}
              onChange={() => {
                setMenuItemAttributes((prevAttributes) => ({
                ...prevAttributes,
                [menuItemName]: {
                  ...prevAttributes[menuItemName],
                  happyWine: !isChecked4,
                },
              }));
              }}/>Happy Hour Wine
              <input type="checkbox" id="features" name="options" value="Cocktail" checked={isChecked5}
              onChange={() => {
                setMenuItemAttributes((prevAttributes) => ({
                ...prevAttributes,
                [menuItemName]: {
                  ...prevAttributes[menuItemName],
                  cocktail: !isChecked5,
                },
              }));
              }}/>Cocktail
              <input type="checkbox" id="features" name="options" value="Brunch" checked={isChecked6}
              onChange={() => {
                setMenuItemAttributes((prevAttributes) => ({
                ...prevAttributes,
                [menuItemName]: {
                  ...prevAttributes[menuItemName],
                  brunch: !isChecked6,
                },
              }));
              }}/>Brunch
            </Grid>
            <Grid item xs={6} className="editPaneItem">
            <Button variant="contained" onClick={updateMenuItem}>
              Save Changes
            </Button>
            </Grid>
          </Grid>
    );
  };

  const updateMenuItem = async () => {
    try {
      const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/updateMenuItem'
        : 'http://localhost:3001/api/updateMenuItem';

      await axios.put(backendURL, {
        menuItemName,
        menuItemPrice,
        menuItemTogo,
        menuItemAlcoholic,
        menuItemHHBeer,
        menuItemHHWine,
        menuItemCocktail,
        menuItemBrunch,
      });

      console.log('Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating menu item', error);
    }
  };

  
  const handleViewToggle = () => {
    setActiveGrid(activeGrid === 1 ? 2 : 1);
    setActiveView(activeView === DBItems.menuItems ? DBItems.inventoryItems : DBItems.menuItems);
    setShowingMenu(!showingMenu);
    setRecipe( [{ item_name: 'Select a menu item to update', quantity: 0}] );
    setMenuItemName('Select a Menu Item');
    setMenuItemPrice('Select a Menu Item');
    setMenuitemTogo('Select a Menu Item');
    setInvItemName('Select an Inventory Item');
    setInvItemCost('Select an Inventory Item');
    setInvItemStock('Select an Inventory Item');
    setinvItemMinimum('Select an Inventory Item');
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
              <div>
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
                  <Button className= "managerMenuSwapButton" variant="contained" disableElevation onClick={handleViewToggle}>
                    Swap Menu/Inventory
                  </Button>
                </div>
                <ManagerNavButtons  items={activeView}/>
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