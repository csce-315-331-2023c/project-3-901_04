import React, { useEffect, useState } from 'react';
import '../styles/Cashier.css';
import Button from '@mui/material/Button';
import { TextField, Grid } from '@mui/material';

function Cashier() {
  const [entrees, setEntrees] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderPrices, setOrderPrices] = useState([]);

  const [showEntrees, setShowEntrees] = useState(false);
  const [showDrinks, setShowDrinks] = useState(false);

  useEffect(() => {
    const backendURL = process.env.NODE_ENV === 'production'
      ? 'https://your-production-url/api/menu'
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

  const handlePlaceOrder = () => {
    console.log('Order placed:', order, orderPrices);
    // TODO: Add functionality to submit order data to backend or database
  };

  return (
    <div className="Cashier">
      <Grid container spacing={2}>
        {/* Left side */}
        <Grid item xs={8.4}> {/* 70% of 12 (Grid's default breakpoint system) is approximately 8.4 */}
          <Button variant="contained" onClick={() => setShowEntrees(!showEntrees)}>
            {showEntrees ? 'Hide Entrees' : 'Show Entrees'}
          </Button>
          &nbsp;{/* This adds a space between buttons */}
          <Button variant="contained" onClick={() => setShowDrinks(!showDrinks)}>
            {showDrinks ? 'Hide Drinks' : 'Show Drinks'}
          </Button>

          {/* Display Entrees or Drinks based on state */}
          {showEntrees && (
            <div>
              <h2>Entrees</h2>
              {entrees.map((entree) => (
                <Button
                  key={entree.entree_name}
                  onClick={() => handleAddItem(entree.entree_name, entree.price)}
                  sx={{
                    margin: '5px',
                    border: '1px solid #c8e6c9',
                    backgroundColor: '#a5d6a7',
                    color: '#0a3a0a',
                    '&:hover': {
                      backgroundColor: '#81c784',
                    },
                    // Add other styles as needed
                  }}
                >
                  {entree.entree_name}
                </Button>
              ))}

            </div>
          )}

          {showDrinks && (
            <div>
              <h2>Drinks</h2>
              {drinks.map((drink) => (
                <Button
                  key={drink.drink_name}
                  onClick={() => handleAddItem(drink.drink_name, drink.price)}
                  sx={{
                    margin: '5px',
                    border: '1px solid #c8e6c9',
                    backgroundColor: '#a5d6a7',
                    color: '#0a3a0a',
                    '&:hover': {
                      backgroundColor: '#81c784',
                    },
                    // Add other styles as needed
                  }}
                >
                  {drink.drink_name}
                </Button>
              ))}

            </div>
          )}
        </Grid>

        {/* Right side */}
        <Grid item xs={3.6}> {/* 30% of 12*/}
          <h2>Order</h2>

          {/* Iterate over the order array to display each item with its price */}
          {order.map((item, index) => (
            <div
              key={index}
              className="OrderItem"
              onClick={() => handleRemoveItem(index)}
              style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', transition: 'background-color 0.3s' }}
            >
              <span>{item}</span>
              <span style={{ marginLeft: 'auto' }}>${orderPrices[index].toFixed(2)}</span>
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


        </Grid>
      </Grid>
    </div>
  );
}

export default Cashier;
