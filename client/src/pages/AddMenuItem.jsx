import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AddMenuItem.css';

const backendBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/api'
    : 'http://localhost:3001/api';



const AddMenuItem = () => {
    const [menuItemName, setMenuItemName] = useState('');
    const [menuItemPrice, setMenuItemPrice] = useState('');
    const [isToGo, setIsToGo] = useState(false);
    const [isSeasonal, setIsSeasonal] = useState(false);
    const [isAlcoholic, setIsAlcoholic] = useState(false);
    const [isHappyHourBeer, setIsHappyHourBeer] = useState(false);
    const [isHappyHourWine, setIsHappyHourWine] = useState(false);
    const [isCocktail, setIsCocktail] = useState(false);
    const [isBrunch, setIsBrunch] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [showFirstHalf, setShowFirstHalf] = useState(true);
    // const [showSecondHalf, setShowSecondHalf] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);


    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };

      
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > window.innerHeight * 0.5) { 
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);


    const navigate = useNavigate();


    const resetFields = () => {
        setMenuItemName('');
        setMenuItemPrice('');
        setIsToGo(false);
        setIsSeasonal(false);
        setIsAlcoholic(false);
        setIsHappyHourBeer(false);
        setIsHappyHourWine(false);
        setIsCocktail(false);
        setIsBrunch(false);
        setIngredients([]);
    };

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await axios.get(`${backendBaseURL}/inventoryItems`);
                setInventoryItems(response.data);
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            }
        };

        fetchInventoryItems();
    }, []);

    const handleBack = () => {
        navigate('/manager');
    };

    const filterInventoryItems = () => {
        const midpoint = Math.ceil(inventoryItems.length / 2);
        return showFirstHalf ? inventoryItems.slice(0, midpoint) : inventoryItems.slice(midpoint);
    };

    const handleIngredientChange = (index, type, value) => {
        const updatedIngredients = ingredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [type]: value };
            }
            return ingredient;
        });
        setIngredients(updatedIngredients);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, { id: '', quantity: '' }]);
    };

    const removeIngredientField = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };

    const addIngredientFromInventory = (inventoryId, itemName) => {
        const newIngredient = {
            id: inventoryId,
            quantity: '',
            name: itemName
        };
        setIngredients([...ingredients, newIngredient]);
    };

    const handleAddEntree = async () => {
        const payload = {
            name: menuItemName,
            price: parseFloat(menuItemPrice),
            togo: isToGo,
            seasonal: isSeasonal,
            ingredients: ingredients.filter(ingredient => ingredient.id && ingredient.quantity)
        };

        try {
            const response = await axios.post(`${backendBaseURL}/addEntreeItem`, payload);
            console.log(response.data);
            alert('Entree item added successfully!');
            resetFields();
        } catch (error) {
            console.error('Error adding entree item:', error);
            alert('Failed to add entree item.');
        }
    };

    const handleAddDrink = async () => {
        const payload = {
            name: menuItemName,
            price: parseFloat(menuItemPrice),
            togo: isToGo,
            alcoholic: isAlcoholic,
            happyhourbeer: isHappyHourBeer ? true : false, // Explicitly send true or false
            happyhourwine: isHappyHourWine ? true : false,
            cocktail: isCocktail,
            brunch: isBrunch,
            ingredients: ingredients.filter(ingredient => ingredient.id && ingredient.quantity)
        };

        try {
            const response = await axios.post(`${backendBaseURL}/addDrinkItem`, payload);
            console.log(response.data);
            alert('Drink item added successfully!');
            resetFields();
        } catch (error) {
            console.error('Error adding drink item:', error);
            alert('Failed to add drink item.');
        }
    };

    return (
        <div className="add-menu-item-layout">
            <div className="form-container">
                <Button className="back-button" onClick={handleBack} variant="outlined">
                    Back to Manager
                </Button>

                <h1 className="header">Add Menu Item</h1>
                <TextField
                    fullWidth
                    label="Menu Item Name"
                    value={menuItemName}
                    onChange={(e) => setMenuItemName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Menu Item Price"
                    value={menuItemPrice}
                    onChange={(e) => setMenuItemPrice(e.target.value)}
                    margin="normal"
                    type="number"
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={isToGo} onChange={(e) => setIsToGo(e.target.checked)} />}
                        label="To-Go"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isSeasonal} onChange={(e) => setIsSeasonal(e.target.checked)} />}
                        label="Seasonal"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isAlcoholic} onChange={(e) => setIsAlcoholic(e.target.checked)} />}
                        label="Alcoholic (Drinks Only)"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isHappyHourBeer} onChange={(e) => setIsHappyHourBeer(e.target.checked)} />}
                        label="Happy Hour Beer (Drinks Only)"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isHappyHourWine} onChange={(e) => setIsHappyHourWine(e.target.checked)} />}
                        label="Happy Hour Wine (Drinks Only)"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isCocktail} onChange={(e) => setIsCocktail(e.target.checked)} />}
                        label="Cocktail (Drinks Only)"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isBrunch} onChange={(e) => setIsBrunch(e.target.checked)} />}
                        label="Brunch (Drinks Only)"
                    />
                </FormGroup>
                <div className="buttons">
                    <Button onClick={handleAddEntree} variant="contained" color="primary">
                        Add Entree Item
                    </Button>
                    <Button onClick={handleAddDrink} variant="contained" color="secondary">
                        Add Drink Item
                    </Button>
                </div>
            </div>

            <div className="ingredients-container">
                <div className="toggle-switches">
                    <FormControlLabel
                        control={<Switch checked={showFirstHalf} onChange={() => setShowFirstHalf(!showFirstHalf)} />}
                        label="Show First Half"
                    />
                    {/* <FormControlLabel
                        control={<Switch checked={showSecondHalf} onChange={() => setShowSecondHalf(!showSecondHalf)} />}
                        label="Show Second Half"
                    /> */}
                </div>
                <div className="added-ingredients">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-field">
                            <span>{ingredient.name}</span>
                            <TextField
                                label="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                style={{ marginRight: '10px' }}
                            />
                            <Button onClick={() => removeIngredientField(index)}>Remove</Button>
                        </div>
                    ))}
                    <Button onClick={addIngredientField}>Add Ingredient</Button>
                </div>
                <div className="inventory-buttons">
                    {filterInventoryItems().map(item => (
                        <Button
                            key={item.id}
                            onClick={() => addIngredientFromInventory(item.id, item.item_name)}
                            variant="outlined"
                            style={{ margin: '5px' }}
                        >
                            {item.item_name}
                        </Button>
                    ))}
                </div>
            </div>
            {showBackToTop && (
                <Button
                    className="back-to-top-button"
                    onClick={scrollToTop}
                    variant="contained"
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        borderRadius: '50%',
                        minWidth: '50px',
                        height: '50px',
                        fontSize: '24px',
                    }}
                >
                    ↑
                </Button>
            )}
        </div>
    );

};

export default AddMenuItem;
