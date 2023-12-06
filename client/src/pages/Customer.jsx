import '../styles/Customer.css';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Grid, Tooltip, InputLabel } from '@mui/material';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

function Customer() {
  //menu items
  const [entrees, setEntrees] = useState([]);
  const [drinks, setDrinks] = useState([]);
  //current order
  const [order, setOrder] = useState([]);
  const [orderPrices, setOrderPrices] = useState([]);
  //visual settings
  const [showEntrees, setShowEntrees] = useState(true);
  const [showDrinks, setShowDrinks] = useState(true);
  const [loading, setLoad] = useState(true);

  //for each order 
  const [orderHist, setHist] = useState([]);
  //for each order's items
  const [orderInst, setInst] = useState([]);
  //order history
  const [popup, setPop] = useState(false);
  //to-go
  const [check, setCheck] = useState(false);
  const custName = JSON.stringify(JSON.parse(localStorage.getItem('user')).name).replace(/\"/g, "");
  const namePass = 'customer';

  //obtains menu information, sets up default view
  useEffect(() => {
    setLoad(true);
    const backendURL = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/api/menu'
      : 'http://localhost:3001/api/menu';
    
    const backendURL3 = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/orderHistory'
    : 'http://localhost:3001/orderHistory';

    const getData = async () => {
      try {
        const response = await fetch(backendURL);
        const res = await response.json();

        setEntrees(res.entrees.sort((a,b) => a.entree_name.localeCompare(b.entree_name)))
        setDrinks(res.drinks.sort((a,b) => a.drink_name.localeCompare(b.drink_name)))

        const response2 = await axios.get(backendURL3, {
          params: {
            custName: custName
          }
        });
        
        const res2 = await response2.data;
        setHist(res2.main.rows);
        setInst(res2.details);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
    setLoad(false);
  }, []);

  //adds item to order list
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

  function reorder(id) {
    handleClearOrder();
    orderInst && orderInst.filter(val => val.id == id).map((item) => (
      handleAddItem(item.drink_name || item.entree_name, item.price)
    ))
  }

  function handleSort(event) {
    var num = event.target.value;
    const newEntrees = [...entrees];
    const newDrinks = [...drinks];
    if (num == 0) {
      newEntrees.sort((a,b) => a.entree_name.localeCompare(b.entree_name))
      setEntrees(newEntrees)
      newDrinks.sort((a,b) => a.drink_name.localeCompare(b.drink_name))
      setDrinks(newDrinks);
    }
    //reverse alphabetical
    else if (num == 1) {
      newEntrees.sort((a,b) => b.entree_name.localeCompare(a.entree_name))
      setEntrees(newEntrees)
      newDrinks.sort((a,b) => b.drink_name.localeCompare(a.drink_name))
      setDrinks(newDrinks);
    }
    //price
    else if (num == 2) {
      newEntrees.sort((a,b) => a.price - b.price)
      setEntrees(newEntrees)
      newDrinks.sort((a,b) => a.price - b.price)
      setDrinks(newDrinks);
    }
    //reverse price
    else if (num == 3) {
      newEntrees.sort((a,b) => b.price - a.price)
      setEntrees(newEntrees)
      newDrinks.sort((a,b) => b.price - a.price)
      setDrinks(newDrinks);
    }
  }

  const handleOpen = () => setPop(true);
  const handleClose = () => setPop(false); 

  async function placeOrder(e) {
    const backendURL2 = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/postid'
    : 'http://localhost:3001/postid';
    try {
        const response = await axios.post(backendURL2, {order, orderPrices, custName, namePass});
        console.log(response.data);
        window.location.reload();
    } catch (error) {
        console.error('Order error', error);
    }
  }

  const handlePlaceOrder = () => {
    console.log('Order placed:', order, orderPrices);
    console.log("customer name: " + custName);
    placeOrder();
    handleClearOrder();
  };
  
  if (loading) {
    console.log('loading');
    return <div>...loading...</div>
  }

  function getName(original) {
    original = JSON.stringify(original).replace(/['"]+/g, '');
    if (original.length > 18) {
      original = original.slice(0, 16) + "...";
      return (original);
    }
    return original;
  }

  function getDateFromTimestamp(tstamp) {
    return (JSON.parse(JSON.stringify(tstamp)).split('T')[0] + " " + JSON.parse(JSON.stringify(tstamp)).split('T')[1].split('.')[0]);
  }

  function getTimeFromTimestamp(tstamp) {
    var timeStr = JSON.parse(JSON.stringify(tstamp)).split('T')[1].split('.')[0];
    return parseInt(timeStr.split(':')[0]);
  }

  function getHour() {
    const time = new Date();
    return time.getHours();
  }

  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 20,
        textTransform: 'none'
      },
      subtitle2: {
        fontSize: 20,
        textTransform: 'none'
      },
      h6: {
        fontSize: 22
      },
      h5: {
        fontSize: 22,
        textTransform: 'none'
      },
      h4: {
        fontSize: 20,
        textTransform: 'none'
      },
      body1: {
        fontSize: 16,
        textTransform: 'none'
      },
      body2: {
        fontsize: 20
      },
    }
  })

  const styles = theme => ({
    tablecell: {
      fontSize: '40pt',
    }
  })

  function Row(props) {
    const [open, setOpen] = useState(false);
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
        <TableRow >
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>

          <TableCell>
            <Button variant='text' onClick={() => reorder(props.od.id)}><Typography variant='subtitle1'>Order</Typography></Button>
          </TableCell>
          <TableCell className={'body'}>{props.od.id}</TableCell>
          <TableCell className={'body'}>{getDateFromTimestamp(props.od.order_timestamp)}</TableCell>
          <TableCell className={'body'}>{props.od.price_total}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell style={{paddingBottom:0, paddingTop:0}} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{margin:1}}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant='h4'>Item Name</Typography></TableCell>
                      <TableCell><Typography variant='h4'>Item Price($)</Typography></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orderInst && orderInst.filter(val => val.id == props.od.id).map((item) => (
                      <TableRow key={item.drink_name || item.entree_name}>
                        <TableCell className={'body'} >
                          {item.drink_name || item.entree_name}
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        </ThemeProvider>
      </React.Fragment>
    );
  }


  return (
    <div className="Customer">
      <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        {/* Left side */}
        <Grid item xs={8.6}> {/* 75% of 12 (Grid's default breakpoint system) is approximately 8.4 */}
          <Button variant="contained" onClick={() => setShowEntrees(!showEntrees)}>
            {showEntrees ? <Typography variant='subtitle2'>Hide Entrees</Typography> : <Typography variant='subtitle2'>Show Entrees</Typography>}
          </Button>
          &nbsp;{/* This adds a space between buttons */}
          <Button variant="contained" onClick={() => setShowDrinks(!showDrinks)}>
            {showDrinks ? <Typography variant='subtitle2'>Hide Drinks</Typography> : <Typography variant='subtitle2'>Show Drinks</Typography>}
          </Button>
          &nbsp;{/* This adds a space between buttons */}
          <Button variant="contained" onClick={handleOpen}>
          <Typography variant='subtitle2'>Order History</Typography>
          </Button>
          <FormControl sx={{m:.5}} size="small">
            <InputLabel variant='standard' htmlFor='uncontrolled-native'>Sort By</InputLabel>
            <NativeSelect label='SortBy' onClick={handleSort}>
              <option value={0}>Alphabetical</option>
              <option value={1}>Reverse Alphabetical</option>
              <option value={2}>Price (low to high)</option>
              <option value={3}>Price (high to low)</option>
            </NativeSelect>
          </FormControl>
          <Modal
            hidebackDrop
            centered
            open={popup}
            onClose={handleClose}
            xs={1}
          >
            <TableContainer component={Paper} sx={{maxHeight:500, overflowY:'auto'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="inherit"><Typography variant='h5'> See Details</Typography></TableCell>
                    <TableCell align="inherit"><Typography variant='h5'> Reorder</Typography></TableCell>
                    <TableCell align="inherit"><Typography variant='h5'> Order ID</Typography></TableCell>
                    <TableCell align="inherit"><Typography variant='h5'> Date and Time</Typography></TableCell>
                    <TableCell align="inherit"><Typography variant='h5'> Total($)</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderHist.map((od, index) => (
                    <Row key={od.id} od={od} index={index}/>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal>

            {/* Display Entrees or Drinks based on state */}
            {showEntrees && (
              <div>
                <h2 class="heading">Entrees</h2>
                {entrees.map((entree) => (
                  <Tooltip 
                    title={<React.Fragment><Typography variant='subtitle1'>{entree.entree_name + ' (' + entree.price + ')'}</Typography></React.Fragment>}
                    placement='top' 
                    size="sm"
                  >
                  {entree.seasonal ? (
                  <Button
                    className="itemButton"
                    key={(entree.entree_name)}
                    onClick={() => handleAddItem(entree.entree_name, entree.price)}
                    variant="outlined"
                    sx={{
                      margin: '5px',
                      border: '1px solid #c8e6c9',
                      backgroundColor: '#f5bf42',
                      color: '#0a3a0a',
                      borderRadius: 2,
                      padding: '30px 0px',
                      '&:hover': {
                        backgroundColor: '#f5aa42',
                      },
                      fontSize: '17px',
                      textTransform: 'inherit'                      
                      // Add other styles as needed
                    }}
                >
                  {getName(entree.entree_name)}
                </Button>
                  ) : (
                    <Button
                      className="itemButton"
                      key={(entree.entree_name)}
                      onClick={() => handleAddItem(entree.entree_name, entree.price)}
                      variant="outlined"
                      sx={{
                        margin: '5px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: '#a5d6a7',
                        color: '#0a3a0a',
                        borderRadius: 2,
                        padding: '30px 0px',
                        '&:hover': {
                          backgroundColor: '#81c784',
                        },
                        fontSize: '17px',
                        textTransform: 'inherit'
                        // Add other styles as needed
                      }}
                  >
                    {getName(entree.entree_name)}
                  </Button>
                  )}
                  </Tooltip>
                ))}

              </div>
            )}

            {showDrinks && (
              <div>
                <h2 class="heading">Drinks</h2>
                {drinks.map((drink) => (
                  <Tooltip 
                  title={<Typography variant='subtitle1'>{drink.drink_name + ' (' + drink.price + ')'}</Typography>}
                  placement='top' 
                  size="sm"
                >
                  {drink.seasonal ? (
                    <Button
                      className="itemButton"
                      key={drink.drink_name}
                      onClick={() => handleAddItem(drink.drink_name, drink.price)}
                      sx={{
                        margin: '5px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: '#f5bf42',
                        color: '#0a3a0a',
                        borderRadius: 2,
                        padding: '30px 0px',
                        '&:hover': {
                          backgroundColor: '#f5aa42',
                        },
                        fontSize: '17px',
                        textTransform: 'inherit'
                        // Add other styles as needed
                      }}
                  >
                    {getName(drink.drink_name)}
                  </Button>
                  ) : (
                    <Button
                      className="itemButton"
                      key={drink.drink_name}
                      onClick={() => handleAddItem(drink.drink_name, drink.price)}
                      sx={{
                        margin: '5px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: '#a5d6a7',
                        color: '#0a3a0a',
                        borderRadius: 2,
                        padding: '30px 0px',
                        '&:hover': {
                          backgroundColor: '#81c784',
                        },
                        textTransform: 'inherit',
                        fontSize: '17px'
                        // Add other styles as needed
                      }}
                  >
                    {getName(drink.drink_name)}
                  </Button>
                  )}
                  </Tooltip>
                ))}

              </div>
            )}
        </Grid>

        {/* Right side */}
        <Grid item xs={3.4}> {/* 30% of 12*/}

        <Grid container spacing={1}>
            <Grid item xs={8.1} className='Ordersign'>
              <h2 class="heading">{custName}</h2>
            </Grid>
            <Grid item xs={3.9} className='Ordersign'>
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
              className="OrderItem"
              onClick={() => handleRemoveItem(index)}
              style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', transition: 'background-color 0.3s' }}
            >
              <span>{item}</span>
              <span style={{ marginLeft: 'auto' }}> ${orderPrices[index].toFixed(2)}</span>
            </div>
          ))}

          <div className="OrderTotal">
          <Typography variant='subtitle1'><strong>Total:</strong> ${orderPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2)}</Typography>
          </div>
          <div style={{ height: '10px' }}></div>

          {/* Action buttons for the order */}
          <Button
            sx={{
              backgroundColor: '#ffcc80',
              color: '#5d4037',
              '&:hover': {
                backgroundColor: '#ffa726',
              },
              textTransform: 'inherit',
              fontSize: '20px'
            }}
            onClick={handleRemoveLastItem}
            className='body'
            >
            Remove Last
          </Button>
          <Button
            sx={{
              backgroundColor: '#ffcc80',
              color: '#5d4037',
              '&:hover': {
                backgroundColor: '#ffa726',
              },
              textTransform: 'inherit',
              fontSize: '20px'
            }}
            onClick={handleClearOrder}
            className='body'
            >
            Clear Order
          </Button>
          <Button
            sx={{
              backgroundColor: '#ffb74d',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ff9800',
              },
              textTransform: 'inherit',
              fontSize: '20px'
            }}
            onClick={handlePlaceOrder}
            className='body'
            >
            Place Order
          </Button>

        </Grid>
      </Grid>
      </ThemeProvider>
    </div>
  );
}

export default Customer
