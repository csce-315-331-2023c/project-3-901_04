import React, { useEffect, useState } from 'react';
import '../styles/Manager.css';
import '../styles/Manager_HC.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TextField, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

/**
 * Manager Component - Handles menu and inventory management for Mo's Irish Pub.
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isHighContrast - Indicates whether high contrast mode is enabled.
 * @returns {JSX.Element} - Rendered component.
 */
function Manager({ isHighContrast }) {
  const navigate = useNavigate();
  
  const [DBItems, setDBItems] = useState({ menuItems: [], inventoryItems: [] });
  const [activeView, setActiveView] = useState(DBItems.menuItems);

  const [menuItemRecipe, setRecipe] = useState([]);
  const [displayedRecipe, setDisplayedRecipe] = useState([]);

  const [activeGrid, setActiveGrid] = useState(2);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [menuItemName, setMenuItemName] = useState('Select a Menu Item');
  const [displayedMenuItemName, setDisplayedMenuItemName] = useState();

  const [menuItemPrice, setMenuItemPrice] = useState('Select a Menu Item');
  const [displayedMenuItemPrice, setDisplayedMenuItemPrice] = useState();

  const [menuItemTogo, setMenuitemTogo] = useState('Select a Menu Item');
  const [displayedMenuItemTogo, setDisplayedMenuitemTogo] = useState();

  
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
    fetchMenu();
    handleViewToggle()
  }, []);

  function fetchMenu(){
    const backendURL = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/api/managerMenu'
      : 'http://localhost:3001/api/managerMenu';
    fetch(backendURL) //backend url
      .then(res => res.json())
      .then(data => {
        setDBItems(data);
        setActiveView(DBItems.menuItems);
        //console.log(data);
      });
  }

  useEffect(() => {
    //console.log('Updated menuItemRecipe:', menuItemRecipe);

    const updatedDisplay = menuItemRecipe.map((item) => ({
      name: item.item_name,
      quantity: item.quantity,
    }));
    
    setDisplayedRecipe(updatedDisplay);

  }, [menuItemRecipe]);

  useEffect(() => {
    /*
    console.log("Updated menuItemName: ", menuItemName);
    console.log("Updated menuItemPrice: ", menuItemPrice);
    console.log("Updated menuItemTogo: ", menuItemTogo);
    console.log("Updated invItemName: ", invItemName);
    console.log("Updated invItemStock: ", invItemStock);
    console.log("Updated invItemCost: ", invItemCost);
    console.log("Updated invItemMinimum: ", invItemMinimum);
    */

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

  }, [menuItemName, menuItemPrice, menuItemTogo, invItemName, invItemStock, invItemCost, invItemMinimum]);

  function handleItemButtonClick(buttonText) {
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

  function handleDeleteInvItem(itemToDelete) {
    const deleteInvItem = async (itemToDelete) => {
      const backendURL2 = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/deleteInvItem'
        : 'http://localhost:3001/api/deleteInvItem';

      try {
        const deleteRes = await axios.delete(backendURL2, {
          params: {
            itemToDelete: itemToDelete,
          },
        });

        console.log(deleteRes.data);

      } catch (error) {
        console.error('Error deleting item:', error);
      }

    };
    deleteInvItem(itemToDelete);
    setDeleteDialogOpen(false);
    window.location.reload();
  }
    
  function handleDeleteMenuItem(itemToDelete) {
    const deleteMenuItem = async (itemToDelete) => {
      const backendURL2 = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/api/deleteMenuItem'
      : 'http://localhost:3001/api/deleteMenuItem';

      try {
        const deleteRes = await axios.delete(backendURL2, {
          params: {
            itemToDelete: itemToDelete,
          },
        });

        console.log(deleteRes.data);
        
      } catch (error) {
        console.error('Error deleting item:', error);
      }

    };
    deleteMenuItem(itemToDelete);
    setDeleteDialogOpen(false);
    window.location.reload();
  }
    

  const inventoryDataDisplay = () => {
    return (

      <div>
        <div class={'reportsLink' + (isHighContrast ? "-HC" : "")}><Link to="/managerReports"><b>Reports</b></Link></div>
        <div class={'ordersLink' + (isHighContrast ? "-HC" : "")}><Link to="/managerOrders"><b>Order History</b></Link></div>
        <div class={'adminToolsLink' + (isHighContrast ? "-HC" : "")}><Link to="/admin-tools"><b>Admin Tools</b></Link></div>

        <Grid container spacing={2}>
              <Grid item xs={6}>
                <h3>Name: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>{displayedInvItemName}</div></h3>
                <TextField
                variant="outlined"
                //value={text}
                //onChange={handleInputChange}
                placeholder="Input New Name"
                >
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <h3>Stock: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>{displayedInvItemStock}</div></h3>
                <TextField
                variant="outlined"
                //value={text}
                //onChange={handleInputChange}
                placeholder="Input New Stock"
                >
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <h3>Cost: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>${displayedInvItemCost}</div></h3>
                <TextField
                variant="outlined"
                //value={text}
                //onChange={handleInputChange}
                placeholder="Input New Cost"
                >
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <h3>Minimum Stock Warning: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>{displayedInvItemMinimum}</div></h3>
                <TextField
                variant="outlined"
                //value={text}
                //onChange={handleInputChange}
                placeholder="Input New MSW"
                >
                </TextField>
              </Grid>
            </Grid>
      </div>
    );
  };

  const menuDataDisplay = () => {
    return (

      <div>

        <div class={'reportsLink' + (isHighContrast ? "-HC" : "")}><Link to="/managerReports"><b>Reports</b></Link></div>
        <div class={'ordersLink' + (isHighContrast ? "-HC" : "")}><Link to="/managerOrders"><b>Order History</b></Link></div>
        <div class={'adminToolsLink' + (isHighContrast ? "-HC" : "")}><Link to="/admin-tools"><b>Admin Tools</b></Link></div>

        <Grid container spacing={2}>
            <Grid item xs={6} className={"editPaneItem" + (isHighContrast ? "-HC" : "")}>
              <h3>Name: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>{displayedMenuItemName}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Input New Name"
              >
              </TextField>
            </Grid>
            <Grid item xs={6} className={"editPaneItem" + (isHighContrast ? "-HC" : "")}>
              <h3>Price: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>${displayedMenuItemPrice}</div></h3>
            <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="Input New Price"
              >
              </TextField>
            </Grid>
            <Grid item xs={6} className={"editPaneItem" + (isHighContrast ? "-HC" : "")}>
              <h3>To-Go: <div className={"displayedValue" + (isHighContrast ? "-HC" : "")}>{displayedMenuItemTogo}</div></h3>
              <TextField
              variant="outlined"
              //value={text}
              //onChange={handleInputChange}
              placeholder="True/False"
              >
              </TextField>
            </Grid>
          </Grid>

      </div>
    );
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
    setShowAddItemForm(false);
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
      <div className={"scrollView" + (isHighContrast ? "-HC" : "")} style={{ height: '600px', overflowY: 'scroll' }}>
        <div>
          {items.map((item) => (
            <Button onClick={() => handleItemButtonClick(item.item_name)} variant="outlined" className={"managerMenuButton" + (isHighContrast ? "-HC" : "")} key={item}>
              {item.item_name}
            </Button>
          ))}
        </div>
      </div>
      
    );
  };

  const { register, handleSubmit, reset } = useForm();

  const onSubmitNewItem = async (data) => {
    try {
      const itemData = {
        itemName: data.itemName,
        stock: data.stock,
        cost: data.cost,
        minStockWarning: data.minStockWarning
      };

      const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/addInventoryItem'
        : 'http://localhost:3001/api/addInventoryItem';



      await axios.post(backendURL, itemData);
      // console.log('Response:', response.data);
      alert('Item added successfully!');

      reset(); // Reset form fields after submission
    } catch (error) {
      console.error('Failed to add item', error);
      alert('Failed to add item.');
    }
  };

  const newItemForm = () => {
    return (
      <div className={"managerForm" + (isHighContrast ? "-HC" : "")}>
        <h2>Add New Inventory Item</h2>
        <form onSubmit={handleSubmit(onSubmitNewItem)}>
          <div className={"formField" + (isHighContrast ? "-HC" : "")}>
            <TextField {...register('itemName')} placeholder="Item Name" required fullWidth />
          </div>
          <div className={"formField" + (isHighContrast ? "-HC" : "")}>
            <TextField {...register('stock')} placeholder="Stock" type="number" required fullWidth />
          </div>
          <div className={"formField" + (isHighContrast ? "-HC" : "")}>
            <TextField {...register('cost')} placeholder="Cost" type="number" required fullWidth />
          </div>
          <div className={"formField" + (isHighContrast ? "-HC" : "")}>
            <TextField {...register('minStockWarning')} placeholder="Minimum Stock Warning" type="number" required fullWidth />
          </div>
          <Button type="submit" className={"submitButton" + (isHighContrast ? "-HC" : "")} variant="contained">Add Item</Button>
        </form>
      </div>
    );
  };


  const [showAddItemForm, setShowAddItemForm] = useState(false);

  // Function to toggle the add item form
  const handleToggleAddItemForm = () => {
    setShowAddItemForm(!showAddItemForm);
    if (!showAddItemForm) {
      // Add any state resets here if you want to hide other components when showing the form
      // For example:
      setShowingMenu(false);
    }
  };

  const handleAddItem = () => {
    navigate('/add-menu-item'); // Use the route you set up for adding a menu item
  };

  return (
    <div className={'manager' + (isHighContrast ? "-HC" : "")}>
      <Grid container spacing={2}>
        
        <Grid item xs={3.6}>
          <div className={'leftGrid' + (isHighContrast ? "-HC" : "")}>
            <div className={'scrollView' + (isHighContrast ? "-HC" : "")}>
              <div>
                <Button className={isHighContrast ? "managerMenuSwapButton-HC managerActionButton-HC" : "managerMenuSwapButton managerActionButton"} variant="contained" disableElevation onClick={handleViewToggle}>
                  Swap Menu/Inventory
                </Button>
                <Button className={isHighContrast ? "toggleAddItemFormButton-HC managerActionButton-HC" : "toggleAddItemFormButton managerActionButton"} variant="contained" disableElevation onClick={handleToggleAddItemForm}>
                  {showAddItemForm ? 'Hide Add Item Form' : 'Show Add Item Form'}
                </Button>
                {!showAddItemForm && (
                  <>
                    <Button className={"managerActionButton" + (isHighContrast ? "-HC" : "")} variant="contained" disableElevation onClick={handleAddItem}>
                      Add Menu Item
                    </Button>
                    <ManagerNavButtons items={activeView}/>
                  </>
                )}
              </div>
            </div>
          </div>
          {showingMenu ? (
            <div className={'managerDeleteButton-Container' + (isHighContrast ? "-HC" : "")}>
              <Button onClick={() => {
                if(displayedMenuItemName !== "Select a Menu Item"){
                  setDeleteDialogOpen(true)} 
                }}
                style={{'background-color': 'rgb(230, 85, 85)', 'color': 'white', 'font-size': '20px'}} className={"managerDeleteButton" + (isHighContrast ? "-HC" : "")}>
                {displayedMenuItemName === 'Select a Menu Item' ? 'Select an Item' : 'Delete'}
              </Button>
                <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    Are you sure you want to delete {displayedMenuItemName}?
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={() => handleDeleteMenuItem(displayedMenuItemName)} style={{"color": "red"}}>
                      Confirm Delete
                    </Button>
                  </DialogActions>
                </Dialog>
            </div>
          ) : (
            <div className={'managerDeleteButton-Container'  + (isHighContrast ? "-HC" : "")}>
              <Button onClick={() => {
                  if(displayedInvItemName !== "Select an Inventory Item"){
                    setDeleteDialogOpen(true)} 
                  }}
                  style={{'background-color': 'rgb(230, 85, 85)', 'color': 'white', 'font-size': '20px'}} className={"managerDeleteButton" + (isHighContrast ? "-HC" : "")}>
                  {displayedInvItemName === "Select an Inventory Item" ? 'Select an Item' : 'Delete'}
                </Button>
                  <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                      Are you sure you want to delete {displayedInvItemName}?
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleDeleteInvItem(displayedInvItemName)} style={{"color": "red"}}>
                        Confirm Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
            </div>
          )}
        </Grid>
        
        {showAddItemForm ? (
          // Show the addItemForm when showAddItemForm is true
          <Grid item xs={5.4}>
            {newItemForm()}
          </Grid>
        ) : (
          // Otherwise, show menu or inventory display based on showingMenu
          <Grid item xs={5.4}>
            <div className={'editPane' + (isHighContrast ? "-HC" : "")}>{dataGridContainer()}</div>
          </Grid>
        )}
  
        {/* Recipe panel is always shown on the right-hand side */}
        <Grid item xs={3}>
          <div className={'rightGrid' + (isHighContrast ? "-HC" : "")}>
            <div>
              <div>
                <h1 className={'recipeTitle' + (isHighContrast ? "-HC" : "")}>Recipe</h1>
              </div>
              <div className={"scrollView" + (isHighContrast ? "-HC" : "")} style={{ height: '600px', overflowY: 'scroll' }}>
                <div>
                  {displayedRecipe && displayedRecipe.map((item, index) => (
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
  );
  
}

export default Manager