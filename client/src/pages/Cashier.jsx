import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import '../styles/Cashier_HC.css'
import Button from '@mui/material/Button';
import { TextField, Grid, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
//import { getTime } from 'date-fns'; 
import axios from 'axios';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Cashier({ isHighContrast }) {
  const [entrees, setEntrees] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderPrices, setOrderPrices] = useState([]);

  const [showEntrees, setShowEntrees] = useState(true);
  const [showDrinks, setShowDrinks] = useState(true);

  //customer name
  const [custName, setCust] = useState("");
  const [check, setCheck] = useState(false);
  const namePass = JSON.stringify(JSON.parse(localStorage.getItem('user')).name).replace(/\"/g, "");

  useEffect(() => {
    const backendURL = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/api/menu'
      : 'http://localhost:3001/api/menu';

    const getData = async () => {
      try {
        const response = await fetch(backendURL);
        const res = await response.json();

        setEntrees(res.entrees);
        setDrinks(res.drinks);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  const handleAddItem = (itemName, itemPrice) => {
    var addon = "";
    if (check == true) {
      entrees.map(current => {
        if (current.entree_name == itemName) {
          addon = " (TOGO)";
        }
      })
    }
    setOrderPrices((prevPrices) => [...prevPrices, itemPrice]);  
    setOrder((prevOrder) => [...prevOrder, itemName + addon]);
  };

  const handleRemoveLastItem = () => {
    setOrder((prevOrder) => prevOrder.slice(0, -1));
    setOrderPrices((prevPrices) => prevPrices.slice(0, -1));
  };

  const handleRemoveItem = (index) => {
    setOrder((prevOrder) => prevOrder.filter((_, itemIndex) => itemIndex !== index));
    setOrderPrices((prevPrices) => prevPrices.filter((_, priceIndex) => priceIndex !== index));
  };

  const handleClearOrder = () => {
    setOrder([]);
    setOrderPrices([]);
  };

  const handleCheck = (event) => {
    setCheck(event.target.checked);
  };



  function getName(original) {
    original = JSON.stringify(original).replace(/['"]+/g, '');
    if (original.length > 18) {
      original = original.slice(0, 16) + "...";
      return (original);
    }
    return original;
  }

  async function placeOrder(e) {
    if(order.length){
      const backendURL2 = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/postid'
      : 'http://localhost:3001/postid';
      try {
          const response = await axios.post(backendURL2, {order, orderPrices, custName, namePass});
          console.log(response.data);
      } catch (error) {
          console.error('Order error', error);
      }
    }
    else{
      console.log("Order is empty. No order placed.");
    }
  }

  const handlePlaceOrder = () => {
    console.log('Order placed:', order, orderPrices);
    console.log("customer name: " + custName);
    // TODO: Need to update inventory, employee id
    placeOrder();
    handleClearOrder();
  };

  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 18,
        textTransform: 'none'
      },
      subtitle2: {
        fontSize: 18,
        textTransform: 'none'
      },
      h6: {
        fontSize: 20
      },
      h5: {
        fontSize: 20,
        textTransform: 'none'
      },
      body1: {
        fontSize: 16,
        textTransform: 'none'
      },
      body2: {
        fontsize: 20
      }
    }
  })

  return (
    <div className={"Cashier" + (isHighContrast ? "-HC" : "")}>
      <ThemeProvider theme={theme}>
        <Grid container spacing={2}>
          {/* Left side */}
          <Grid item xs={8.6}> {/* 70% of 12 (Grid's default breakpoint system) is approximately 8.4 */}
            <Button variant="contained" onClick={() => setShowEntrees(!showEntrees)}>
              {showEntrees ? <Typography variant='subtitle2'>Hide Entrees</Typography> : <Typography variant='subtitle2'>Show Entrees</Typography>}
            </Button>
            &nbsp;{/* This adds a space between buttons */}
            <Button variant="contained" onClick={() => setShowDrinks(!showDrinks)}>
              {showDrinks ? <Typography variant='subtitle2'>Hide Drinks</Typography> : <Typography variant='subtitle2'>Show Drinks</Typography>}
            </Button>

            {/* Display Entrees or Drinks based on state */}
            {showEntrees && (
              <div>
                <h2 class={"heading" + (isHighContrast ? "-HC" : "")}>Entrees</h2>
                {entrees.sort((a,b) => a.entree_name[0].localeCompare(b.entree_name[0])).map((entree) => (
                  <Tooltip 
                    title={<React.Fragment><Typography variant='subtitle1'>{entree.entree_name + ' (' + entree.price + ')'}</Typography></React.Fragment>}
                    placement='top' 
                    size="sm"
                  >
                  {entree.seasonal ? (
                  <Button
                    className={"itemButton" + (isHighContrast ? "-HC" : "")}
                    key={(entree.entree_name)}
                    onClick={() => handleAddItem(entree.entree_name, entree.price)}
                    variant="outlined"
                    sx={{
                      margin: '5px',
                      border: '1px solid #c8e6c9',
                      backgroundColor: (isHighContrast ? '#333' : '#f5bf42'),
                      color: (isHighContrast ? '#f5bf42' : '#0a3a0a'),
                      borderRadius: 2,
                      padding: '30px 0px',
                      '&:hover': {
                        backgroundColor: (isHighContrast ? '#000' : '#f5aa42'),
                      },
                      // Add other styles as needed
                    }}
                >
                  {<Typography variety='body1'>{getName(entree.entree_name)}</Typography>}
                </Button>
                  ) : (
                    <Button
                      className={"itemButton" + (isHighContrast ? "-HC" : "")}
                      key={(entree.entree_name)}
                      onClick={() => handleAddItem(entree.entree_name, entree.price)}
                      variant="outlined"
                      sx={{
                        margin: '5px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: (isHighContrast ? '#333' : '#a5d6a7'),
                        color: (isHighContrast ? '#0f0' : '#0a3a0a'),
                        borderRadius: 2,
                        padding: '30px 0px',
                        '&:hover': {
                          backgroundColor: (isHighContrast ? '#000' : '#81c784'),
                        },
                        // Add other styles as needed
                      }}
                  >
                    {<Typography variety='body1'>{getName(entree.entree_name)}</Typography>}
                  </Button>
                  )}
                  </Tooltip>
                ))}

              </div>
            )}

            {showDrinks && (
              <div>
                <h2 class={"heading" + (isHighContrast ? "-HC" : "")}>Drinks</h2>
                {drinks.sort((a,b) => a.drink_name[0].localeCompare(b.drink_name[0])).map((drink) => (
                  <Tooltip 
                  title={<Typography variant='subtitle1'>{drink.drink_name + ' (' + drink.price + ')'}</Typography>}
                  placement='top' 
                  size="sm"
                >
                  {drink.seasonal ? (
                    <Button
                      className={"itemButton" + (isHighContrast ? "-HC" : "")}
                      key={drink.drink_name}
                      onClick={() => handleAddItem(drink.drink_name, drink.price)}
                      sx={{
                        margin: '5px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: (isHighContrast ? '#333' : '#f5bf42'),
                        color: (isHighContrast ? '#f5bf42' : '#0a3a0a'),
                        borderRadius: 2,
                        padding: '30px 0px',
                        '&:hover': {
                          backgroundColor: (isHighContrast ? '#000' : '#f5aa42'),
                        },
                        // Add other styles as needed
                      }}
                  >
                    {<Typography variant='body1'>{getName(drink.drink_name)}</Typography>}
                  </Button>
                  ) : (
                    <Button
                      className={"itemButton" + (isHighContrast ? "-HC" : "")}
                      key={drink.drink_name}
                      onClick={() => handleAddItem(drink.drink_name, drink.price)}
                      sx={{
                        margin: '5px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: (isHighContrast ? '#333' : '#a5d6a7'),
                        color: (isHighContrast ? '#0f0' : '#0a3a0a'),
                        borderRadius: 2,
                        padding: '30px 0px',
                        '&:hover': {
                          backgroundColor: (isHighContrast ? '#000' : '#81c784'),
                        },
                        // Add other styles as needed
                      }}
                  >
                    {<Typography variant='body1'>{getName(drink.drink_name)}</Typography>}
                  </Button>
                  )}
                  </Tooltip>
                ))}

              </div>
            )}
          </Grid>

          {/* Right side */}
          <Grid item xs={3.4}> {/* 30% of 12*/}

            <Grid container spacing={2}>
              <Grid item xs={8.9}>
                {/*For the customer name*/}
                {''}
                <TextField 
                    value={custName}
                    onChange={(e) => {setCust(e.target.value)}}
                    label="Customer Name"
                    margin="dense"
                    maxRows="1"
                    size="small"
                    fullWidth
                    variant="filled"
                    sx={{
                      input: {
                        color: (isHighContrast ? "#0f0" : "black"),
                        background: (isHighContrast ? "#333" : "#c8e6c9")
                      }
                    }}
                    color="success"
                    inputProps={{style: {fontSize: 18, textColorStyle: (isHighContrast ? "0f0" : "grey")}}} // font size of input text
                    InputLabelProps={{style: {fontSize: 18, textColorStyle: (isHighContrast ? "0f0" : "grey")}}} // font size of input label
                />
              </Grid>
              <Grid item xs={3.1} className={'Ordersign' + (isHighContrast ? "-HC" : "")}>
              <FormGroup>
                <FormControlLabel control={<Checkbox
                  checked={check}
                  onChange={handleCheck}
                />} label={<Typography variant='subtitle1'>To-go</Typography>}/>

                </FormGroup>
              </Grid>
            </Grid>

            {/* Iterate over the order array to display each item with its price */}
            {order.map((item, index) => (
              <div
                key={index}
                className={"OrderItem" + (isHighContrast ? "-HC" : "")}
                onClick={() => handleRemoveItem(index)}
                style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', transition: 'background-color 0.3s' }}
              >
                <span>{item}</span>
                <span style={{ marginLeft: 'auto' }}> ${orderPrices[index].toFixed(2)}</span>
              </div>
            ))}

            <div className={"OrderTotal" + (isHighContrast ? "-HC" : "")}>
            <Typography variant='subtitle1'><strong>Total:</strong> ${orderPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2)}</Typography>
            </div>
            <div style={{ height: '10px' }}></div>

            {/* Action buttons for the order */}
          <Button
            sx={{
              backgroundColor: (isHighContrast ? '#ff9900' : '#ffcc80'),
              color: (isHighContrast ? '#000' : '#5d4037'),
              '&:hover': {
                backgroundColor: '#ffa726',
              },
            }}
            onClick={handleRemoveLastItem}>
            Remove Last Item
          </Button>
          <Button
            sx={{
              backgroundColor: (isHighContrast ? '#ff9900' : '#ffcc80'),
              color: (isHighContrast ? '#000' : '#5d4037'),
              '&:hover': {
                backgroundColor: '#ffa726',
              },
            }}
            onClick={handleClearOrder}>
            Clear Order
          </Button>
          <Button
            sx={{
              backgroundColor: (isHighContrast ? '#ff9900' : '#ffb74d'),
              color: (isHighContrast ? '#000' : '#fff'),
              '&:hover': {
                backgroundColor: '#ff9800',
              },
            }}
            onClick={handlePlaceOrder}>
            Place Order
          </Button>


          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default Cashier;
