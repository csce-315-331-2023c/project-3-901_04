import '../styles/Customer.css';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { TextField, Grid, Tooltip } from '@mui/material';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
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
//import downarrow from '../media/down-arrow-svgrepo-com.svg';
//import uparrow from '../media/up-arrow-svgrepo-com.svg';
//import 'java.util.Dictionary';

function Customer() {
  const [entrees, setEntrees] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderPrices, setOrderPrices] = useState([]);

  const [showEntrees, setShowEntrees] = useState(true);
  const [showDrinks, setShowDrinks] = useState(true);
  const [loading, setLoad] = useState(true);

  //for each order 
  const [orderHist, setHist] = useState([]);
  //for each order's items
  const [orderInst, setInst] = useState([]);
  //const orderInst = new FormData();
  //var orderInst = [];
  const [popup, setPop] = useState(false);
  const custName = JSON.stringify(JSON.parse(localStorage.getItem('user')).name).replace(/\"/g, "");
  //const custName = "Name1";
  console.log(JSON.stringify(JSON.parse(localStorage.getItem('user'))));

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

        setEntrees((res.entrees));
        setDrinks((res.drinks));

        const response2 = await axios.post(backendURL3, {custName});
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

  const handleAddItem = (itemName, itemPrice) => {
    setOrder((prevOrder) => [...prevOrder, itemName]);
    setOrderPrices((prevPrices) => [...prevPrices, itemPrice]);
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

  const handleReorder = (orderId) => {
    //console.log(orderInst[0].id);
    /*orderInst && orderInst.filter(val => val.id == orderId).map((item) => (
      handleAddItem(item.entree_name || item.drink_name, item.price)
    ))*/
  };

  const handleOpen = () => setPop(true);
  const handleClose = () => setPop(false); 

  async function placeOrder(e) {
    const backendURL2 = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/postid'
    : 'http://localhost:3001/postid';
    try {
        const response = await axios.post(backendURL2, {order, orderPrices, custName});
        console.log(response.data);
    } catch (error) {
        console.error('Order error', error);
    }
  }

  const handlePlaceOrder = () => {
    console.log('Order placed:', order, orderPrices);
    console.log("customer name: " + custName);
    // TODO: Need to update inventory, employee id
    placeOrder();
    handleClearOrder();
  };
  
  if (loading) {
    console.log('loading');
    return <div>...loading...</div>
  }

  function getName(original) {
    original = JSON.stringify(original).replace(/['"]+/g, '')
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
    //console.log(timeStr);
    return parseInt(timeStr.split(':')[0]);
  }

  function checkHappyHour(time) {
    var timeInt = getTimeFromTimestamp(time);
    if (timeInt >= 15 && timeInt < 18) {
      return true;
    }
    return false;
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow:24,
    overflowY: "scroll",
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translate(-50%, -50%)',
    maxWidth: '50%',
  };

  const itemToolTip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
  ))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  function Row(props) {
    const [open, setOpen] = useState(false);
    console.log(orderHist);
    console.log(orderInst);
    console.log(props.index);
    console.log(getTimeFromTimestamp(orderHist[0].order_timestamp));
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset', borderTop: 'unset' } }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>

          <TableCell>
            {<Button onClick={handleReorder(props.od.id)}>Order</Button>}
          </TableCell>
          
          <TableCell>
            {props.od.id}
          </TableCell>
          <TableCell>{getDateFromTimestamp(props.od.order_timestamp)}</TableCell>
          <TableCell>{props.od.price_total}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell style={{paddingBottom:0, paddingTop:0}} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{margin:1}}>
                <Typography variant="h6" gutterBottom component="div">
                  Order Details
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Item Cost</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orderInst && orderInst.filter(val => val.id == props.od.id).map((item) => (
                      <TableRow key={item.drink_name || item.entree_name}>
                        <TableCell>
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
      </React.Fragment>
    );
  }


  return (
    <div className="Customer">
      <Grid container spacing={2}>
        {/* Left side */}
        <Grid item xs={8}> {/* 75% of 12 (Grid's default breakpoint system) is approximately 8.4 */}
          <Button variant="contained" onClick={() => setShowEntrees(!showEntrees)}>
            {showEntrees ? 'Hide Entrees' : 'Show Entrees'}
          </Button>
          &nbsp;{/* This adds a space between buttons */}
          <Button variant="contained" onClick={() => setShowDrinks(!showDrinks)}>
            {showDrinks ? 'Hide Drinks' : 'Show Drinks'}
          </Button>
          &nbsp;{/* This adds a space between buttons */}
          <Button variant="contained" onClick={handleOpen}>
            Order History
          </Button>
          <Modal
            hidebackDrop
            centered
            open={popup}
            onClose={handleClose}
            xs={1}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="inherit">See Details</TableCell>
                    <TableCell align="inherit">Reorder</TableCell>
                    <TableCell align="inherit">Order ID</TableCell>
                    <TableCell align="inherit">Date and Time</TableCell>
                    <TableCell align="inherit">Total($)</TableCell>
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
              {entrees.sort((a,b) => a.entree_name[0].localeCompare(b.entree_name[0])).map((entree) => (
                <itemToolTip title={entree.entree_name} placement='top' size="sm">
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
                    // Add other styles as needed
                  }}
                >
                  {getName(entree.entree_name)}
                </Button>
                </itemToolTip>
              ))}

            </div>
          )}

          {showDrinks && (
            <div>
              <h2 class="heading">Drinks</h2>
              {drinks.sort((a,b) => a.drink_name[0].localeCompare(b.drink_name[0])).map((drink) => (
                <Tooltip title={drink.drink_name}>
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
                    // Add other styles as needed
                  }}
                >
                  {getName(drink.drink_name)}
                </Button>
                </Tooltip>
              ))}

            </div>
          )}
        </Grid>

        {/* Right side */}
        <Grid item xs={3.6}> {/* 30% of 12*/}

        <Grid container spacing={1}>
            <Grid item xs={2} className='Ordersign'>
              <h2 class="heading">{custName}</h2>
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
            <strong>Total:</strong> ${orderPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2)}
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
            }}
            onClick={handleRemoveLastItem}>
            Remove Last Item
          </Button>
          <Button
            sx={{
              backgroundColor: '#ffcc80',
              color: '#5d4037',
              '&:hover': {
                backgroundColor: '#ffa726',
              },
            }}
            onClick={handleClearOrder}>
            Clear Order
          </Button>
          <Button
            sx={{
              backgroundColor: '#ffb74d',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ff9800',
              },
            }}
            onClick={handlePlaceOrder}>
            Place Order
          </Button>
          <h2>* Happy hour item</h2>


        </Grid>
      </Grid>
    </div>
  );
}

export default Customer
