/**
 * Filename: app.js
 * Description: Main application file for the Mos Irish Pub backend.
 * Author: Your Name
 * Last Modified: 2023-12-05
 */

const express = require('express');
const cors = require('cors');
const {
    Pool
} = require('pg');
const {
    all
} = require('axios');
const dotenv = require('dotenv').config();
const User = require('./mongo');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); //enable cors for all routes
app.use(express.json());

/**
 * PostgreSQL connection pool configuration.
 * 
 * @type {Object}
 * @property {string} user - The PostgreSQL user.
 * @property {string} host - The PostgreSQL server host.
 * @property {string} database - The name of the PostgreSQL database.
 * @property {string} password - The password for the PostgreSQL user.
 * @property {number} port - The port on which the PostgreSQL server is listening.
 *
 * @example
 * // Example usage:
 * const pool = new Pool({
 *   user: process.env.PSQL_USER,
 *   host: process.env.PSQL_HOST,
 *   database: process.env.PSQL_DATABASE,
 *   password: process.env.PSQL_PASSWORD,
 *   port: 5432,
 * });
 */
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: 5432,
});

/**
 * Handle requests to the root path and respond with a welcome message.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Example usage:
 * // GET /
 * app.get('/', (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/', (req, res) => {
    res.send('Mos Irish Pub Backened!');
});

/**
 * Retrieve menu items, including entrees and drinks, with categorized drink items.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error during the query process.
 *
 * @example
 * // Example usage:
 * // GET /api/menu
 * app.get('/api/menu', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/menu', async (req, res) => {
    try {
        const entreeRes = await pool.query('SELECT entree_name, price FROM entrees WHERE togo = false;');
        const drinkRes = await pool.query('SELECT * FROM drinks');

        let getDraft = [];
        let getBottled = [];
        let getWine = [];
        let getCocktails = [];
        let getNoAlch = [];
        let getBrunchDrinks = [];

        drinkRes.rows.forEach(function (drink) {
            if (drink.alcoholic == true) {
                if (drink.brunch == true) {
                    getBrunchDrinks.push([drink.drink_name, drink.price]);
                } else {
                    if (drink.cocktail == true) {
                        getCocktails.push([drink.drink_name, drink.price]);
                    } else {
                        if (drink.drink_name.includes('(Bottled)')) {
                            getBottled.push([drink.drink_name.slice(0, drink.drink_name.length - 9), drink.price]);
                        } else {
                            if (drink.drink_name.includes('(Glass)') || drink.drink_name.includes('(Bottle)')) {
                                if (drink.drink_name.includes('(Glass)')) {
                                    if (drink.happyhourwine == true) {
                                        getWine.push([drink.drink_name.slice(0, drink.drink_name.length - 7), ("" + drink.price + "*")]);
                                    } else {
                                        getWine.push([drink.drink_name.slice(0, drink.drink_name.length - 7), drink.price]);
                                    }
                                } else {
                                    getWine.push([drink.drink_name, drink.price]);
                                }
                            } else {
                                if (drink.happyhourbeer == true) {
                                    getDraft.push([drink.drink_name, ("" + drink.price + "*")]);
                                } else {
                                    getDraft.push([drink.drink_name, drink.price]);
                                }
                            }
                        }
                    }
                }
            } else {
                getNoAlch.push([drink.drink_name, drink.price]);
            }
        });

        const menu = {
            entrees: entreeRes.rows,
            drinks: drinkRes.rows,
            draft: getDraft,
            bottled: getBottled,
            wine: getWine,
            cocktails: getCocktails,
            noAlch: getNoAlch,
            brunchDrinks: getBrunchDrinks
        };

        console.log("menu Query successful. Sending json.");

        res.json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query Failure :(');
    }
});

/**
 * Retrieve the menu items and inventory items for the manager's view.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error during the query process.
 *
 * @example
 * // Example usage:
 * // GET /api/managerMenu
 * app.get('/api/managerMenu', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/managerMenu', async (req, res) => {
    try {
        const menuRes = await pool.query('(SELECT entree_name AS "item_name" FROM entrees UNION SELECT drink_name FROM drinks) ORDER BY item_name;');
        const inventoryRes = await pool.query('SELECT item_name FROM inventory ORDER BY item_name;');

        const managerMenu = {
            menuItems: menuRes.rows,
            inventoryItems: inventoryRes.rows
        };

        console.log("managerMenu Query successful. Sending json.");
        res.json(managerMenu);

    } catch (err) {
        console.error(err);
        res.status(500).send('Query Failure :(');
    }
});

/**
 * Gets order history of an user
 * @param custName The name of the user
 * @return array Array of 2 dictionaries, one with order instances, second with the congregated details of all orders
 */
app.get('/orderHistory', async (req, res) => {
    try {
        const custName = req.query.custName;
        /*var drinkQuery = "SELECT DISTINCT orders.id, orders.customer_name, orders.price_total, drinks.drink_name, drinks.price,  order_timestamp FROM orders JOIN orderdrinkcontents ON orderdrinkcontents.order_id=orders.id JOIN drinks ON drinks.id = orderdrinkcontents.drink_id WHERE orders.customer_name = '" + custName + "' ORDER BY orders.id DESC;";
        const drinkHist = (await pool.query(drinkQuery));
        var entreeQuery = "SELECT DISTINCT orders.id, orders.customer_name, orders.price_total, entrees.entree_name, entrees.price,  order_timestamp FROM orders JOIN orderentreecontents ON orderentreecontents.order_id=orders.id JOIN entrees ON entrees.id = orderentreecontents.entree_id WHERE orders.customer_name = '" + custName + "' ORDER BY orders.id DESC;"
        const entreeHist = (await pool.query(entreeQuery));
        const orderHist = drinkHist.rows.concat(entreeHist.rows);*/

        var orderQuery = "SELECT DISTINCT orders.id, orders.price_total, order_timestamp FROM orders WHERE orders.customer_name = '" + custName + "' ORDER BY orders.id DESC;";
        var orderDrinkQuery = "SELECT DISTINCT orders.id, drinks.drink_name, drinks.price FROM orders JOIN orderdrinkcontents ON orderdrinkcontents.order_id=orders.id JOIN drinks ON drinks.id = orderdrinkcontents.drink_id WHERE orders.customer_name = '" + custName + "' ORDER BY orders.id DESC;";
        var orderEntreeQuery = "SELECT DISTINCT orders.id, entrees.entree_name, entrees.price FROM orders JOIN orderentreecontents ON orderentreecontents.order_id=orders.id JOIN entrees ON entrees.id = orderentreecontents.entree_id WHERE orders.customer_name = '" + custName + "' ORDER BY orders.id DESC;";
        const mainHist = await pool.query(orderQuery);

        const drinkHist = await pool.query(orderDrinkQuery);
        const entreeHist = await pool.query(orderEntreeQuery);
        const orderHist = drinkHist.rows.concat(entreeHist.rows);

        res.json({
            main: mainHist,
            details: orderHist
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Query Failure :(');
    }
});

/**
 * Delete a menu item along with its associated recipes and order contents.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error during the deletion process.
 *
 * @example
 * // Example usage:
 * // DELETE /api/deleteMenuItem?itemToDelete=Burger
 * app.delete('/api/deleteMenuItem', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.delete('/api/deleteMenuItem', async (req, res) => {
    const deleteMe = req.query.itemToDelete;

    const deleteEntreeRecipes = () => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM entreerecipes
                        WHERE entree_id IN (
                            SELECT id
                            FROM entrees
                            WHERE entree_name = '` + deleteMe + `'
                        );`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rowCount); // rowCount contains the number of affected rows
            }
            });
        });
    };

    const deleteEntreeContents = () => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM orderentreecontents
                        WHERE entree_id IN (
                            SELECT id
                            FROM entrees
                            WHERE entree_name = '` + deleteMe + `'
                        );`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rowCount); // rowCount contains the number of affected rows
            }
            });
        });
    };

    const deleteEntree = () => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM entrees WHERE entree_name = '` + deleteMe + `';`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rowCount); // rowCount contains the number of affected rows
            }
            });
        });
    };

    const deleteDrinkRecipe = () => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM drinkrecipes
                        WHERE drink_id IN (
                            SELECT id
                            FROM drinks
                            WHERE drink_name = '` + deleteMe + `'
                        );`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rowCount); // rowCount contains the number of affected rows
            }
            });
        });
    };

    const deleteDrinkContents = () => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM orderdrinkcontents
                        WHERE drink_id IN (
                            SELECT id
                            FROM drinks
                            WHERE drink_name = '` + deleteMe + `'
                        );`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rowCount); // rowCount contains the number of affected rows
            }
            });
        });
    };

    const deleteDrink = () => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM drinks WHERE drink_name = '` + deleteMe + `';`, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rowCount); // rowCount contains the number of affected rows
            }
            });
        });
    };

    deleteEntreeRecipes()
    .then(rowsAffected1 => {
        console.log('deleteEntreeRecipes affected rows:', rowsAffected1);
        return deleteEntreeContents();
    })
    .then(rowsAffected2 => {
        console.log('deleteEntreeContents affected rows:', rowsAffected2);
        return deleteEntree();
    })
    .then(rowsAffected3 => {
        console.log('deleteEntree affected rows:', rowsAffected3);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    deleteDrinkRecipe()
    .then(rowsAffected1 => {
        console.log('deleteDrinkRecipe affected rows:', rowsAffected1);
        return deleteDrinkContents();
    })
    .then(rowsAffected2 => {
        console.log('deleteDrinkContents affected rows:', rowsAffected2);
        return deleteDrink();
    })
    .then(rowsAffected3 => {
        console.log('deleteDrink affected rows:', rowsAffected3);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

/**
 * Delete an inventory item along with its associated recipes.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error during the deletion process.
 *
 * @example
 * // Example usage:
 * // DELETE /api/deleteInvItem?itemToDelete=Tomatoes
 * app.delete('/api/deleteInvItem', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.delete('/api/deleteInvItem', async (req, res) => {
    const deleteMe = req.query.itemToDelete;
    try {
        pool.query(`DELETE FROM entreerecipes
                    WHERE inventory_id IN (
                        SELECT id
                        FROM inventory
                        WHERE item_name = '` + deleteMe + `'
                    );`).then(
            pool.query(`DELETE FROM drinkrecipes
                    WHERE inventory_id IN (
                        SELECT id
                        FROM inventory
                        WHERE item_name = '` + deleteMe + `'
                    );`).then(
                pool.query(`DELETE FROM inventory WHERE item_name = '` + deleteMe + `'`)
            ));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to delete inventory item ' + deleteMe
        });
    }
});

/**
 * Get the recipe, menu item information, and inventory item information for a requested item.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error while retrieving information for the requested item.
 *
 * @example
 * // Example usage:
 * // GET /api/recipe?requestedItem=ChickenSoup
 * app.get('/api/recipe', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/recipe', async (req, res) => {

    const reqItem = req.query.requestedItem;
    console.log("Finding recipe for item: ", reqItem);

    try {
        const recipeResult = await pool.query("SELECT item_name, quantity FROM (SELECT DISTINCT entree_name, item_name, quantity FROM entreerecipes JOIN entrees ON entrees.id = entreerecipes.entree_id JOIN inventory ON inventory.id = entreerecipes.inventory_id WHERE entree_name = '" + reqItem + "' UNION SELECT DISTINCT drink_name, item_name, quantity FROM drinkrecipes JOIN drinks ON drinks.id = drinkrecipes.drink_id JOIN inventory ON inventory.id = drinkrecipes.inventory_id WHERE drink_name = '" + reqItem + "') AS recipes;");
        const menuResult = await pool.query("SELECT entree_name AS item_name, price, togo FROM entrees WHERE entree_name = '" + reqItem + "' UNION SELECT drink_name AS item_name, price, togo FROM drinks WHERE drink_name = '" + reqItem + "';");
        const invResult = await pool.query("SELECT item_name, stock, cost, min_stock_warning FROM inventory WHERE item_name = '" + reqItem + "';");
        console.log('/api/recipe queries success');
        if (menuResult.rows.length != 0 && invResult.rows.length == 0) { //If reqItem is a menu item
            res.json({
                recipe: recipeResult.rows,
                menuItemInfo: menuResult.rows,
                invItemInfo: [{
                    item_name: '',
                    stock: -1,
                    cost: -1,
                    min_stock_warning: -1
                }]
            });
        } else if (menuResult.rows.length == 0 && invResult.rows.length != 0) { //If reqItem is an inventory item
            res.json({
                recipe: recipeResult.rows,
                menuItemInfo: [{
                    item_name: '',
                    price: -1,
                    togo: false
                }],
                invItemInfo: invResult.rows
            })
        } else {
            res.json({
                recipe: recipeResult.rows,
                menuItemInfo: menuResult.rows,
                invItemInfo: invResult.rows
            })
        }

        console.log("Recipe:", recipeResult.rows);
        console.log("menuResult:", menuResult.rows);
        console.log("invResult: ", invResult.rows);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error executing the query'
        });
        return;
    }
});

/**
 * Log in a user with the provided email and password.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error during the login process.
 *
 * @example
 * // Example usage:
 * // POST /login
 * // Request body: { "email": "john.doe@example.com", "password": "securePassword" }
 * app.post('/login', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (user && user.password === password) { // In production, use a hashed password comparison
            res.json({
                status: 'ok',
                user: user
            });
        } else {
            res.json({
                status: 'error',
                user: false
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

/**
 * Sign up a new user with the provided name, email, and password.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error during the signup process.
 *
 * @example
 * // Example usage:
 * // POST /signup
 * // Request body: { "name": "John Doe", "email": "john.doe@example.com", "password": "securePassword" }
 * app.post('/signup', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.post('/signup', async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    try {
        let user = await User.findOne({
            email
        });
        if (user) {
            res.json({
                status: 'error',
                error: 'User already exists'
            });
        } else {
            user = new User({
                name,
                email,
                password
            });
            await user.save();
            res.json({
                status: 'ok',
                user: user
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up');
    }
});

/**
 * Check if an employee with the given name exists.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error checking employee status.
 *
 * @example
 * // Example usage:
 * // GET /api/isEmployee?name=JohnDoe
 * app.get('/api/isEmployee', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/isEmployee', async (req, res) => {
    const {
        name
    } = req.query; // Get the name from query parameter

    try {
        // Query to check if an employee with the given name exists
        const result = await pool.query('SELECT id, name FROM employees WHERE name = $1', [name]);

        // Check if any rows are returned
        const isEmployee = result.rows.length > 0;

        res.json({
            isEmployee
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

/**
 * Called when an order is placed. Will update the orders, orderentreecontents, and orderdrinkcontents tables.
 * @param orders The names of ordered menu items 
 * @param orderPrices The prices of ordered menu items 
 * @param custName The name of the orderer
 * @param employeeName The name of the employee taking the order
 * @param employeeId The ID of the employee taking the order
 * @return void
 */
app.post('/postid', async (req, res) => {
    const orders = req.body['order'];
    const orderPrices = req.body['orderPrices'];
    const custName = req.body['custName'];
    const employeeName = req.body['namePass'];
    const employeeId = await pool.query("SELECT id FROM employees WHERE name = '" + employeeName + "';");
    var count = 0;
    var idarr = [];
    //Gets the ids of items
    try {
        //Arbitrary amount; surely no one orders 100 items in a single sitting right?
        while (count < 100) {
            if (orders[count] == null) {
                break;
            }
            const element = ((await pool.query("SELECT id, entree_name FROM entrees WHERE entree_name='" + orders[count] + "' UNION SELECT id, drink_name FROM drinks WHERE drink_name='" + orders[count] + "';")));
            count += 1;
            idarr.push(parseInt(element.rows[0].id));
        }
    } catch (err) {
        console.error(err);
    }
    //Sort the array of all ids into positive and negative ids (for entrees and drinks)
    entreearr = []
    drinkarr = []
    idarr.map((id) => {
        if (id > -1) {
            entreearr.push(id);
        } else {
            drinkarr.push(id);
        }
    });
    //Make the new order TODO employee id
    try {
        var highestOrderId = await pool.query("SELECT id FROM orders ORDER BY id DESC LIMIT 1;");
        console.log("INSERT INTO orders (id, price_total, table_num, customer_name, employee_id, year, month, week, day, hour, minute, order_timestamp) VALUES (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + "," + parseFloat(orderPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2)) + "," + parseInt(30 * Math.random() + 1) + ",'" + custName + "'," + parseInt(employeeId.rows[0].id) + "," + parseInt(getYear()) + "," + parseInt(getMonth()) + "," + parseInt((new Date()).getWeek()) + "," + parseInt(getDay()) + "," + parseInt(getHour()) + "," + parseInt(getMinute()) + ",'" + JSON.stringify(getTimeDate()) + "');")
        pool.query("INSERT INTO orders (id, price_total, table_num, customer_name, employee_id, year, month, week, day, hour, minute, order_timestamp) VALUES (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + "," + parseFloat(orderPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2)) + "," + parseInt(30 * Math.random() + 1) + ",'" + custName + "'," + parseInt(employeeId.rows[0].id) + "," + parseInt(getYear()) + "," + parseInt(getMonth()) + "," + parseInt((new Date()).getWeek()) + "," + parseInt(getDay()) + "," + parseInt(getHour()) + "," + parseInt(getMinute()) + ",'" + JSON.stringify(getTimeDate()) + "');")
            .then(async result => { //Prevent race condition
                //Insert into orderentreecontents
                if (entreearr.length) {
                    var orderEntreeString = "INSERT INTO orderentreecontents (order_id, entree_id) VALUES";
                    try {
                        for (var i = 0; i < entreearr.length; i++) {
                            if (i != 0) {
                                orderEntreeString = orderEntreeString + ",";
                            }
                            orderEntreeString = orderEntreeString + " (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + ", " + entreearr[i] + ")";
                        }
                        orderEntreeString = orderEntreeString + ";";
                        //console.log(orderEntreeString);
                        pool.query(orderEntreeString);
                    } catch (e) {
                        console.log(e);
                    }
                }
                //Insert into orderdrinkcontents
                if (drinkarr.length) {
                    var orderDrinkString = "INSERT INTO orderdrinkcontents (order_id, drink_id) VALUES";
                    try {
                        for (var i = 0; i < drinkarr.length; i++) {
                            if (i != 0) {
                                orderDrinkString = orderDrinkString + ",";
                            }
                            orderDrinkString = orderDrinkString + " (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + ", " + drinkarr[i] + ")";
                        }
                        orderDrinkString = orderDrinkString + ";";
                        console.log(orderDrinkString);
                        pool.query(orderDrinkString);
                    } catch (e) {
                        console.log(e);
                    }
                }
                //Get recipe of each drink/entree
                var getEntreeInventory = "SELECT DISTINCT entree_name, item_name, quantity FROM entreerecipes JOIN entrees ON entrees.id = entreerecipes.entree_id JOIN inventory ON inventory.id = entreerecipes.inventory_id WHERE entree_id in (";
                var getDrinkInventory = "SELECT DISTINCT drink_name, item_name, quantity FROM drinkrecipes JOIN drinks ON drinks.id = drinkrecipes.drink_id JOIN inventory ON inventory.id = drinkrecipes.inventory_id WHERE drink_id in (";
                var allInventory;
                console.log("A");
                try {
                    let entreeInventoryQuantities = [];
                    let drinkInventoryQuantities = [];
                    if (entreearr.length != 0) {
                        for (var i = 0; i < entreearr.length; i++) {
                            if (i != 0) {
                                getEntreeInventory = getEntreeInventory + ",";
                            }
                            getEntreeInventory = getEntreeInventory + parseInt(entreearr[i]);
                        }
                        getEntreeInventory = getEntreeInventory + ");";
                        //console.log(getEntreeInventory);
                        entreeInventoryQuantities = await pool.query(getEntreeInventory);
                    }
                    //res.send(JSON.stringify((entreeInventoryQuantities).rows[0].quantity));

                    if (drinkarr.length != 0) {
                        for (var i = 0; i < drinkarr.length; i++) {
                            if (i != 0) {
                                getDrinkInventory = getDrinkInventory + ",";
                            }
                            getDrinkInventory = getDrinkInventory + parseInt(drinkarr[i]);
                        }
                        getDrinkInventory = getDrinkInventory + ");";
                        //console.log(getDrinkInventory);
                        drinkInventoryQuantities = await pool.query(getDrinkInventory);
                    }
                    if (entreearr.length == 0) {
                        allInventory = Object.assign({}, drinkInventoryQuantities.rows);
                    } else if (drinkarr.length == 0) {
                        allInventory = Object.assign({}, entreeInventoryQuantities.rows);
                    } else {
                        allInventory = Object.assign({}, entreeInventoryQuantities.rows, drinkInventoryQuantities.rows);
                    }
                } catch (errr) {
                    console.log(errr);
                }
                console.log("B");
                //Subtract inventory based on recipes
                var updateInventory;
                var allInventoryLen = parseInt(JSON.stringify(Object.keys(allInventory).length));
                try {
                    for (var i = 0; i < allInventoryLen; i++) {
                        updateInventory = "UPDATE inventory SET stock = CASE item_name WHEN '" + allInventory[i].item_name + "' THEN stock - " + parseFloat(allInventory[i].quantity) + " ELSE 0 END WHERE inventory.item_name in (" + "'" + allInventory[i].item_name + "'" + ");";
                        console.log(updateInventory);
                        pool.query(updateInventory);
                    }
                } catch (erm) {
                    console.log(erm);
                }
                console.log("Order was taken successfully. All tables updated.");
                res.send("Success!");
            });
    } catch (er) {
        console.log(er);
    }
});

//REPORTS --------------------------------------------------------------------

/**
 * Generate a product report summarizing the total sales of each product within a specified time range.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error generating the product report.
 *
 * @example
 * // Example usage:
 * // GET /api/productReport?startTime=2023-01-01T00:00&endTime=2023-01-02T00:00
 * app.get('/api/productReport', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/productReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.endTime.split('T');

        const startDate = startDateReq[0] + " " + startDateReq[1] + ":00";
        const endDate = endDateReq[0] + " " + endDateReq[1] + ":00";


        const productReportRes = await pool.query(`
        SELECT day, SUM(sum) AS total_sum FROM (
            SELECT
                date_trunc('day', o_o.order_timestamp) AS day,
                sum(quantity) AS sum
            FROM drinkrecipes
            JOIN drinks ON drinks.id = drinkrecipes.drink_id
            JOIN inventory ON inventory.id = drinkrecipes.inventory_id
            JOIN orderdrinkcontents ON orderdrinkcontents.drink_id = drinkrecipes.drink_id
            JOIN orders AS o_o ON o_o.id = orderdrinkcontents.order_id
            WHERE o_o.order_timestamp >= '` + startDate + `' AND o_o.order_timestamp < '` + endDate + `'
            GROUP BY date_trunc('day', o_o.order_timestamp)

            UNION ALL

            SELECT
                date_trunc('day', o_o.order_timestamp) AS day,
                sum(quantity) AS sum
            FROM entreerecipes
            JOIN entrees AS ent ON ent.id = entreerecipes.entree_id
            JOIN inventory ON inventory.id = entreerecipes.inventory_id
            JOIN orderentreecontents ON orderentreecontents.entree_id = entreerecipes.entree_id
            JOIN orders AS o_o ON o_o.id = orderentreecontents.order_id
            WHERE o_o.order_timestamp >= '` + startDate + `' AND o_o.order_timestamp < '` + endDate + `'
            GROUP BY date_trunc('day', o_o.order_timestamp)
        ) AS combined_sums
        GROUP BY day
        ORDER BY day;`);

        const productReport = {
            productReport: productReportRes.rows,
        };

        console.log("Product Report generated from " + startDate + " to " + endDate + ". Sending json.");
        res.json(productReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Product Report Failure :(');
    }
});

/**
 * Generate a sales report for items sold within a specified time range.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error generating the sales report.
 *
 * @example
 * // Example usage:
 * // GET /api/salesReport?startTime=2023-01-01T00:00&endTime=2023-01-02T00:00
 * app.get('/api/salesReport', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/salesReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.endTime.split('T');

        const startDate = startDateReq[0] + " " + startDateReq[1] + ":00";
        const endDate = endDateReq[0] + " " + endDateReq[1] + ":00";


        const salesReportRes = await pool.query(`
            SELECT drink_name as item_name, COUNT(drink_id) as quantity
            FROM orderdrinkcontents
            JOIN drinks ON drinks.id = orderdrinkcontents.drink_id
            WHERE order_id IN (SELECT id FROM orders WHERE order_timestamp >= '` + startDate + `' AND order_timestamp < '` + endDate + `')
            GROUP BY drink_id, drink_name

            UNION ALL

            SELECT entree_name as item_name, COUNT(entree_id) as quantity
            FROM orderentreecontents
            JOIN entrees ON entrees.id = orderentreecontents.entree_id
            WHERE order_id IN (SELECT id FROM orders WHERE order_timestamp >= '` + startDate + `' AND order_timestamp < '` + endDate + `')
            GROUP BY entree_id, entree_name

            ORDER BY
                item_name ASC;`);

        const salesReport = {
            salesReport: salesReportRes.rows,
        };

        console.log("Sales Report generated from " + startDate + " to " + endDate + ". Sending json.");
        res.json(salesReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Sales Report Failure :(');
    }
});

/**
 * Generate a report on inventory items with excess stock compared to total sales.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error generating the excess report.
 *
 * @example
 * // Example usage:
 * // GET /api/excessReport?startTime=2023-01-01T00:00
 * app.get('/api/excessReport', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/excessReport', async (req, res) => {
    try {
        console.log(req.query.startTime);
        let startDateReq = req.query.startTime.split('T'); //Probably need to modify this guy

        const startDate = startDateReq[0] + " " + startDateReq[1] + ":00";

        const excessReportRes = await pool.query(`
        WITH TotalSales AS (
            SELECT i.id AS inventory_id, COALESCE(SUM(CASE WHEN o_o.order_timestamp >= '` + startDate + `' THEN COALESCE(r.quantity, d.quantity, 0) ELSE 0 END), 0) AS total_sold
            FROM inventory i
            LEFT JOIN entreerecipes r ON i.id = r.inventory_id
            LEFT JOIN drinkrecipes d ON i.id = d.inventory_id
            LEFT JOIN orderentreecontents o_e ON r.entree_id = o_e.entree_id
            LEFT JOIN orderdrinkcontents o_d ON d.drink_id = o_d.drink_id
            LEFT JOIN orders o_o ON o_e.order_id = o_o.id OR o_d.order_id = o_o.id
            GROUP BY i.id
        )
        
        SELECT
            i.item_name AS inventory_name, i.stock AS current_stock, COALESCE(s.total_sold, 0) AS total_sold, (i.stock + COALESCE(s.total_sold, 0)) AS initial_stock, (COALESCE(s.total_sold, 0) / (i.stock + COALESCE(s.total_sold, 0))::FLOAT) * 100 AS percent_consumed
        FROM inventory i
        LEFT JOIN TotalSales s ON i.id = s.inventory_id
        WHERE (COALESCE(s.total_sold, 0) / (i.stock + COALESCE(s.total_sold, 0))::FLOAT) * 100 < 10;
        `);

        const excessReport = {
            excessReport: excessReportRes.rows,
        };

        console.log("Excess Report generated from " + startDate + " to today. Sending json.");
        res.json(excessReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Excess Report Failure :(');
    }
});

/**
 * Generate a report on items in the inventory that need restocking.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error generating the restock report.
 *
 * @example
 * // Example usage:
 * // GET /api/restockReport
 * app.get('/api/restockReport', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/restockReport', async (req, res) => {
    try {

        const restockReportRes = await pool.query(`
            SELECT item_name, stock FROM inventory WHERE stock <= min_stock_warning
        `);

        const restockReport = {
            restockReport: restockReportRes.rows,
        };

        console.log("Restock Report generated. Sending json.");
        res.json(restockReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Restock Report Failure :(');
    }
});

/**
 * Generate a report on the most frequently paired entrees and drinks within a specified time range.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error generating the WST (Wine, Spirits, and Tapas) report.
 *
 * @example
 * // Example usage:
 * // GET /api/WSTReport?startTime=2023-01-01T00:00&endTime=2023-01-02T00:00
 * app.get('/api/WSTReport', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/WSTReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.endTime.split('T');

        const startDate = startDateReq[0] + " " + startDateReq[1] + ":00";
        const endDate = endDateReq[0] + " " + endDateReq[1] + ":00";


        const WSTReportRes = await pool.query(`
        SELECT entrees.entree_name AS entree_name, drinks.drink_name AS drink_name, COUNT(*) AS pair_freq
        FROM orderentreecontents
        JOIN orderdrinkcontents ON orderentreecontents.order_id = orderdrinkcontents.order_id
        JOIN orders ON orderentreecontents.order_id = orders.id
        JOIN entrees ON orderentreecontents.entree_id = entrees.id
        JOIN drinks ON orderdrinkcontents.drink_id = drinks.id
        WHERE orders.order_timestamp >= '` + startDate + `' AND orders.order_timestamp < '` + endDate + `'
        GROUP BY entrees.entree_name, drinks.drink_name
        ORDER BY pair_freq DESC
        LIMIT 10;
        `);

        const WSTReport = {
            WSTReport: WSTReportRes.rows,
        };

        console.log("WST Report generated from " + startDate + " to " + endDate + ". Sending json.");
        res.json(WSTReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('WST Report Failure :(');
    }
});
//END OF REPORTS -----------------------------------------------------------

//MANAGER ORDER VIEWER -----------------------------------------------------

/**
 * Retrieve orders within a specified time range for a manager view.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error retrieving manager orders.
 *
 * @example
 * // Example usage:
 * // GET /api/managerOrders?startTime=2023-01-01T00:00&endTime=2023-01-02T00:00
 * app.get('/api/managerOrders', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/managerOrders', async (req, res) => {
    try {
        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.endTime.split('T');

        const startDate = startDateReq[0] + " " + startDateReq[1] + ":00";
        const endDate = endDateReq[0] + " " + endDateReq[1] + ":00";

        const ordersRes = await pool.query(`
            SELECT * FROM ORDERS WHERE order_timestamp >= '` + startDate + `' AND order_timestamp < '` + endDate + `';
            `);

        const orders = {
            orders: ordersRes.rows,
        };

        console.log("Orders from " + startDate + " to " + endDate + " fetched for manager. Sending json.");
        res.json(orders);
    } catch {
        console.error(err);
        res.status(500).send('Manager Orders Failure :(');
    }
});

/**
 * Retrieve order contents and metadata for a specific order ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error retrieving order contents.
 *
 * @example
 * // Example usage:
 * // GET /api/orderContents?id=123
 * app.get('/api/orderContents', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/orderContents', async (req, res) => {
    try {
        let id = req.query.id;

        const orderMetaData = await pool.query(`
            SELECT orders.*, employees.name AS employee_name
            FROM orders
            JOIN employees ON orders.employee_id = employees.id
            WHERE orders.id = ` + id + `;
        `);
        const orderContents = await pool.query(`
            SELECT order_id, entree_name AS item_name, COUNT(*) AS item_count
            FROM orderentreecontents 
            JOIN entrees ON entrees.id = orderentreecontents.entree_id
            JOIN orders ON orders.id = orderentreecontents.order_id
            WHERE order_id = ` + id + `
            GROUP BY order_id, entree_name
            
            UNION ALL
            
            SELECT order_id, drink_name AS item_name, COUNT(*) AS item_count
            FROM orderdrinkcontents 
            JOIN drinks ON drinks.id = orderdrinkcontents.drink_id
            JOIN orders ON orders.id = orderdrinkcontents.order_id
            WHERE order_id = ` + id + `
            GROUP BY order_id, drink_name;
        `);

        const orderData = {
            orderMetaData: orderMetaData.rows,
            orderContents: orderContents.rows
        };

        console.log("Order Data retrieved for order #" + id + ". Sending json.");
        res.json(orderData);

    } catch {
        console.error(err);
        res.status(500).send('Orders Contents Failure :(');
    }
});
//END OF MANAGER ORDER VIEWER ----------------------------------------------

/**
 * returns the current timestamp
 * @returns timestamp
 */
function getTimeDate() {
    const time = new Date();
    const year = getYear();
    const day = getDay()
    const month = getMonth();
    const hour = getHour();
    const minute = getMinute();
    const second = getSecond();
    return (year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
}

/**
 * Returns the current year
 * @returns current year
 */
function getYear() {
    const time = new Date();
    return time.getFullYear();
}

/**
 * Returns the current month
 * @returns current month
 */
function getMonth() {
    const time = new Date();
    return time.getMonth() + 1;
}

/**
 * Returns the current week
 * @returns current week
 */
Date.prototype.getWeek = function () {
    var start = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - start) / 86400000) + start.getDay() + 1) / 7);
}

/**
 * Returns the current day
 * @returns current day
 */
function getDay() {
    const time = new Date();
    return time.toLocaleString("en-US", {
        day: '2-digit'
    })
}

/**
 * Gets the current Hour
 * @returns current hour
 */
function getHour() {
    const time = new Date();
    return time.getHours();
}

/**
 * Gets the current Minute
 * @returns current minute
 */
function getMinute() {
    const time = new Date();
    return time.getMinutes();
}

/**
 * Gets the current second
 * @returns current second
 */
function getSecond() {
    const time = new Date();
    return time.getSeconds();
}

/**
 * Add a new inventory item to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error adding the inventory item.
 *
 * @example
 * // Example usage:
 * // POST /api/addInventoryItem
 * // {
 * //   "itemName": "Coffee Beans",
 * //   "stock": 100,
 * //   "cost": 5.99,
 * //   "minStockWarning": 20
 * // }
 * app.post('/api/addInventoryItem', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.post('/api/addInventoryItem', async (req, res) => {
    const {
        itemName,
        stock,
        cost,
        minStockWarning
    } = req.body;

    try {
        const maxIdResult = await pool.query('SELECT MAX(id) FROM inventory');
        const idMax = maxIdResult.rows[0].max + 1;

        const queryText = 'INSERT INTO Inventory (id, item_name, stock, cost, min_stock_warning) VALUES ($1, $2, $3, $4, $5)';
        const values = [idMax, itemName, stock, cost, minStockWarning];
        await pool.query(queryText, values);

        res.json({
            message: 'Item added successfully',
            itemId: idMax
        });
    } catch (error) {
        console.error('Error adding item to inventory', error);
        res.status(500).json({
            error: 'Error adding item to inventory',
            message: error.message
        });
    }
});

/**
 * Add a new entree item to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error adding the entree item.
 *
 * @example
 * // Example usage:
 * // POST /api/addEntreeItem
 * // {
 * //   "name": "Grilled Salmon",
 * //   "price": 15.99,
 * //   "togo": true,
 * //   "seasonal": true,
 * //   "ingredients": [
 * //     {"id": 1, "quantity": 2},
 * //     {"id": 2, "quantity": 1}
 * //   ]
 * // }
 * app.post('/api/addEntreeItem', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.post('/api/addEntreeItem', async (req, res) => {
    const {
        name,
        price,
        togo,
        seasonal,
        ingredients
    } = req.body;

    try {
        await pool.query('BEGIN');

        // Fetch the current maximum id from the entrees table
        const maxEntreeIdResult = await pool.query('SELECT MAX(id) FROM entrees');
        const newEntreeId = (maxEntreeIdResult.rows[0].max || 0) + 1;

        // Insert the new entree with the new ID
        const entreeName = seasonal ? `(S) ${name}` : name;
        await pool.query(
            'INSERT INTO entrees (id, entree_name, price, togo, seasonal) VALUES ($1, $2, $3, $4, $5);',
            [newEntreeId, entreeName, price, togo, seasonal]
        );

        // Insert the ingredients for the new entree
        for (const {
                id: inventoryId,
                quantity
            } of ingredients) {
            const maxRecipeIdResult = await pool.query('SELECT MAX(id) FROM entreerecipes');
            const newRecipeId = (maxRecipeIdResult.rows[0].max || 0) + 1;

            await pool.query(
                'INSERT INTO entreerecipes (id, entree_id, inventory_id, quantity) VALUES ($1, $2, $3, $4);',
                [newRecipeId, newEntreeId, inventoryId, quantity]
            );
        }

        await pool.query('COMMIT');
        res.status(201).json({
            message: 'Entree item added successfully',
            entreeId: newEntreeId
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding entree item:', error);
        res.status(500).json({
            error: 'Error adding entree item',
            message: error.message
        });
    }
});

/**
 * Add a new drink item to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error adding the drink item.
 *
 * @example
 * // Example usage:
 * // POST /api/addDrinkItem
 * // {
 * //   "name": "Mojito",
 * //   "price": 8.99,
 * //   "togo": true,
 * //   "alcoholic": true,
 * //   "happyhourbeer": false,
 * //   "happyhourwine": false,
 * //   "cocktail": true,
 * //   "brunch": false,
 * //   "ingredients": [
 * //     {"id": 1, "quantity": 2},
 * //     {"id": 2, "quantity": 1}
 * //   ]
 * // }
 * app.post('/api/addDrinkItem', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.post('/api/addDrinkItem', async (req, res) => {
    const {
        name,
        price,
        togo,
        alcoholic,
        happyhourbeer,
        happyhourwine,
        cocktail,
        brunch,
        ingredients
    } = req.body;
    console.log(req.body);
    try {
        await pool.query('BEGIN');

        const maxDrinkIdResult = await pool.query('SELECT MIN(id) FROM drinks');
        const newDrinkId = (maxDrinkIdResult.rows[0].min || 0) - 1; // Assuming negative ids for drinks

        // Insert the new drink
        await pool.query(
            'INSERT INTO drinks (id, drink_name, price, togo, alcoholic, happyhourbeer, happyhourwine, cocktail, brunch) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);',
            [newDrinkId, name, price, togo, alcoholic, happyhourbeer, happyhourwine, cocktail, brunch]
        );

        // Insert the ingredients for the new drink
        for (const {
                id: inventoryId,
                quantity
            } of ingredients) {
            const maxDrinkRecipeIdResult = await pool.query('SELECT MAX(id) FROM drinkrecipes');
            const newDrinkRecipeId = (maxDrinkRecipeIdResult.rows[0].max || 0) + 1;

            await pool.query(
                'INSERT INTO drinkrecipes (id, drink_id, inventory_id, quantity) VALUES ($1, $2, $3, $4);',
                [newDrinkRecipeId, newDrinkId, inventoryId, quantity]
            );
        }

        await pool.query('COMMIT');
        res.json({
            message: 'Drink item added successfully',
            drinkId: newDrinkId
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding drink item:', error);
        res.status(500).json({
            error: 'Error adding drink item',
            message: error.message
        });
    }
});

/**
 * Retrieve all inventory items from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error fetching inventory items.
 *
 * @example
 * // Example usage:
 * // GET /api/inventoryItems
 * app.get('/api/inventoryItems', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/inventoryItems', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, item_name FROM inventory ORDER BY item_name;');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).send('Error fetching inventory items');
    }
});

/**
 * Retrieve all users from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error fetching users.
 *
 * @example
 * // Example usage:
 * // GET /api/users
 * app.get('/api/users', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}); // Fetch all documents from the users collection
        res.json(users); // Send the result back in the response
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users');
    }
});

/**
 * Delete a user based on the provided user ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error deleting the user.
 *
 * @example
 * // Example usage:
 * // DELETE /api/users/123
 * app.delete('/api/users/:userId', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.delete('/api/users/:userId', async (req, res) => {
    const {
        userId
    } = req.params; // Get the userId from the URL parameters

    try {
        // Assuming you have a User model set up with mongoose
        const result = await User.findByIdAndDelete(userId);

        if (result) {
            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

/**
 * Get employee status by name.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error fetching employee status.
 */
app.get('/api/employeeStatus/:name', async (req, res) => {
    const {
        name
    } = req.params;

    try {
        const employeeStatus = await pool.query('SELECT * FROM employees WHERE name = $1', [name]);
        if (employeeStatus.rows.length > 0) {
            const {
                ismanager,
                clockedin
            } = employeeStatus.rows[0];
            res.json({
                isEmployee: true,
                isManager: ismanager,
                isClockedIn: clockedin
            });
        } else {
            res.json({
                isEmployee: false,
                isManager: false,
                isClockedIn: false
            });
        }
    } catch (error) {
        console.error('Error fetching employee status:', error);
        res.status(500).send('Error fetching employee status');
    }
});

/**
 * Update the status of an employee based on the provided information.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error updating the employee status.
 *
 * @example
 * // Example usage:
 * // POST /api/updateEmployeeStatus
 * // {
 * //   "name": "JohnDoe",
 * //   "isEmployee": true,
 * //   "isManager": false,
 * //   "isClockedIn": true
 * // }
 * app.post('/api/updateEmployeeStatus', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.post('/api/updateEmployeeStatus', async (req, res) => {
    const {
        name,
        isEmployee,
        isManager,
        isClockedIn
    } = req.body;

    // If isManager is true, we ensure isEmployee is also set to true
    const effectiveIsEmployee = isEmployee || isManager;

    try {
        if (!effectiveIsEmployee) {
            // If not an employee, delete the user if they exist in the employees table
            await pool.query('DELETE FROM employees WHERE name = $1', [name]);
            console.log('deleted user');
        } else {
            // Check if the user is already an employee
            const employee = await pool.query('SELECT * FROM employees WHERE name = $1', [name]);

            if (employee.rowCount > 0) {
                // User exists, update their status
                await pool.query('UPDATE employees SET ismanager = $1, clockedin = $2 WHERE name = $3', [isManager, isClockedIn, name]);
                console.log('updated');
            } else {
                // User does not exist and is marked as an employee, add them to the table
                const maxIdResult = await pool.query('SELECT MAX(id) FROM employees');
                const newId = maxIdResult.rows[0].max != null ? maxIdResult.rows[0].max + 1 : 0;
                await pool.query('INSERT INTO employees (id, name, ismanager, clockedin) VALUES ($1, $2, $3, $4)', [newId, name, isManager, isClockedIn]);
                console.log('added user');
            }
        }
        res.json({
            success: true
        });
    } catch (error) {
        console.error('Error updating employee status:', error);
        res.status(500).json({
            error: 'Error updating employee status',
            message: error.message
        });
    }
});

/**
 * Retrieve the manager status for a given employee name.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @throws {Error} If there is an error checking the manager status.
 *
 * @example
 * // Example usage:
 * // GET /api/isManager?name=JohnDoe
 * app.get('/api/isManager', async (req, res) => {
 *   // ... function implementation ...
 * });
 */
app.get('/api/isManager', async (req, res) => {
    const { name } = req.query;

    try {
        console.log(name);
        const result = await pool.query('SELECT ismanager FROM employees WHERE name = $1', [name]);
        
        if (result.rows.length > 0) {
            const isManager = result.rows[0].ismanager;
            res.json({ isManager: isManager === 't' || isManager === true });
        } else {
            res.json({ isManager: false });
        }
    } catch (error) {
        console.error('Error checking manager status:', error);
        res.status(500).send('Error checking manager status');
    }
});


/**
 * Start the server and listen for incoming requests on the specified port.
 *
 * @param {number} PORT - The port on which the server will listen.
 * @param {function} callback - A callback function to be executed once the server is successfully listening.
 * @returns {void}
 *
 * @example
 * // Start the server on port 3000
 * app.listen(3000, () => {
 *   console.log('Server is running on http://localhost:3000');
 * });
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});