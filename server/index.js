const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { all } = require('axios');
const dotenv = require('dotenv').config();
const User = require('./mongo');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); //enable cors for all routes
app.use(express.json());

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: 5432,
});

app.get('/', (req, res) => {
    res.send('Mos Irish Pub Backened!');
});

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

        drinkRes.rows.forEach(function(drink) {
            if(drink.alcoholic == true){
              if(drink.brunch == true){
                getBrunchDrinks.push([drink.drink_name, drink.price]);
              }
              else{
                if(drink.cocktail == true){
                  getCocktails.push([drink.drink_name, drink.price]);
                }
                else{
                  if(drink.drink_name.includes('(Bottled)')){
                    getBottled.push([drink.drink_name.slice(0, drink.drink_name.length - 9), drink.price]);
                  }
                  else{
                    if(drink.drink_name.includes('(Glass)') || drink.drink_name.includes('(Bottle)')){
                      if(drink.drink_name.includes('(Glass)')){
                        if(drink.happyhourwine == true){
                          getWine.push([drink.drink_name.slice(0, drink.drink_name.length - 7), ("" + drink.price + "*")]);
                        }
                        else{
                          getWine.push([drink.drink_name.slice(0, drink.drink_name.length - 7), drink.price]);
                        }
                      }
                      else{
                        getWine.push([drink.drink_name, drink.price]);
                      }
                    }
                    else{
                      if(drink.happyhourbeer == true){
                        getDraft.push([drink.drink_name, ("" + drink.price + "*")]);
                      }
                      else{
                        getDraft.push([drink.drink_name, drink.price]);
                      }
                    }
                  }
                }
              }
            }
            else{
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

app.get('/api/recipe', async (req, res) => {

    const reqItem = req.query.requestedItem;
    console.log("Finding recipe for item: ", reqItem);

    try {
        const recipeResult = await pool.query("SELECT item_name, quantity FROM (SELECT DISTINCT entree_name, item_name, quantity FROM entreerecipes JOIN entrees ON entrees.id = entreerecipes.entree_id JOIN inventory ON inventory.id = entreerecipes.inventory_id WHERE entree_name = '" + reqItem + "' UNION SELECT DISTINCT drink_name, item_name, quantity FROM drinkrecipes JOIN drinks ON drinks.id = drinkrecipes.drink_id JOIN inventory ON inventory.id = drinkrecipes.inventory_id WHERE drink_name = '" + reqItem + "') AS recipes;");
        const menuResult = await pool.query("SELECT entree_name AS item_name, price, togo FROM entrees WHERE entree_name = '" + reqItem + "' UNION SELECT drink_name AS item_name, price, togo FROM drinks WHERE drink_name = '" + reqItem + "';");
        const invResult = await pool.query("SELECT item_name, stock, cost, min_stock_warning FROM inventory WHERE item_name = '" + reqItem + "';");
        console.log('/api/recipe queries success');
        if(menuResult.rows.length != 0 && invResult.rows.length == 0){//If reqItem is a menu item
            res.json({ 
                recipe: recipeResult.rows,
                menuItemInfo: menuResult.rows,
                invItemInfo: [ {item_name: '', stock: -1, cost: -1, min_stock_warning: -1} ]
            });
        }
        else if(menuResult.rows.length == 0 && invResult.rows.length != 0){ //If reqItem is an inventory item
            res.json({
                recipe: recipeResult.rows,
                menuItemInfo: [ {item_name: '', price: -1, togo: false} ],
                invItemInfo: invResult.rows
            })
        }
        else{
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
        res.status(500).json({ error: 'Error executing the query' });
        return;
      }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) { // In production, use a hashed password comparison
            res.json({ status: 'ok', user: user });
        } else {
            res.json({ status: 'error', user: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            res.json({ status: 'error', error: 'User already exists' });
        } else {
            user = new User({ name, email, password });
            await user.save();
            res.json({ status: 'ok', user: user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up');
    }
});

app.get('/api/isEmployee', async (req, res) => {
    const { name } = req.query; // Get the name from query parameter

    try {
        // Query to check if an employee with the given name exists
        const result = await pool.query('SELECT id, name FROM employees WHERE name = $1', [name]);

        // Check if any rows are returned
        const isEmployee = result.rows.length > 0;

        res.json({ isEmployee });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

/**
 * Called when an order is placed. Will update the orders, orderentreecontents, and orderdrinkcontents tables.
 */
app.post('/postid', async (req, res) => {
    const orders = req.body['order'];
    const orderPrices = req.body['orderPrices'];
    const custName = req.body['custName'];
    var count = 0;
    var idarr = [];
    //Gets the ids of items
    try {
        //Arbitrary amount; surely no one orders 100 items in a single sitting right?
        while (count < 100){
            if (orders[count] == null) {
                break;
            }
            const element = ((await pool.query("SELECT id, entree_name FROM entrees WHERE entree_name='" + orders[count] + "' UNION SELECT id, drink_name FROM drinks WHERE drink_name='" + orders[count] + "';")));
            count += 1;
            idarr.push(parseInt(element.rows[0].id));
        }
    }
    catch (err) {
        console.error(err);
    }

    //Sort the array of all ids into positive and negative ids (for entrees and drinks)
    entreearr = []
    drinkarr = []
    idarr.map((id) => {
        if (id > -1) {
            entreearr.push(id);
        }
        else {
            drinkarr.push(id);
        }
    })

    //Make the new order TODO employee id
    try {
        var highestOrderId = await pool.query("SELECT id FROM orders ORDER BY id DESC LIMIT 1;");
        pool.query("INSERT INTO orders (id, price_total, table_num, customer_name, employee_id, year, month, week, day, hour, minute, order_timestamp) VALUES (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + "," + parseFloat(orderPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2)) + "," + parseInt(30 * Math.random() + 1) + ",'" + custName + "'," + 0 + "," + parseInt(getYear()) + "," + parseInt(getMonth()) + "," + parseInt((new Date()).getWeek()) + "," + parseInt(getDay()) + "," + parseInt(getHour()) + "," + parseInt(getMinute()) + ",'" + JSON.stringify(getTimeDate()) + "');");
    }
    catch (er) {
        console.log(er);
    }

    //Insert into orderentreecontents
    var orderEntreeString = "INSERT INTO orderentreecontents (order_id, entree_id) VALUES";
    try {
        for (var i = 0; i < entreearr.length; i ++) {
            if (i != 0) {
                orderEntreeString = orderEntreeString + ",";
            }
            orderEntreeString = orderEntreeString + " (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + ", " + entreearr[i] +")";
        }
        orderEntreeString = orderEntreeString + ";";
        pool.query(orderEntreeString);
    }
    catch (e) {
        console.log(e);
    }

    //Insert into orderdrinkcontents
    var orderDrinkString = "INSERT INTO orderdrinkcontents (order_id, drink_id) VALUES";
    try {
        for (var i = 0; i < drinkarr.length; i ++) {
            if (i != 0) {
                orderDrinkString = orderDrinkString + ",";
            }
            orderDrinkString = orderDrinkString + " (" + parseInt(parseInt(highestOrderId.rows[0].id) + 1) + ", " + drinkarr[i] +")";
        }
        orderDrinkString = orderDrinkString + ";";
        pool.query(orderDrinkString);
    }
    catch (e) {
        console.log(e);
    }

    //Get recipe of each drink/entree
    var getEntreeInventory = "SELECT DISTINCT entree_name, item_name, quantity FROM entreerecipes JOIN entrees ON entrees.id = entreerecipes.entree_id JOIN inventory ON inventory.id = entreerecipes.inventory_id WHERE entree_id in (";
    var getDrinkInventory = "SELECT DISTINCT drink_name, item_name, quantity FROM drinkrecipes JOIN drinks ON drinks.id = drinkrecipes.drink_id JOIN inventory ON inventory.id = drinkrecipes.inventory_id WHERE drink_id in (";
    var allInventory;
    try {
        for (var i = 0; i < entreearr.length; i ++) {
            if (i != 0) {
                getEntreeInventory = getEntreeInventory + ",";
            }
            getEntreeInventory = getEntreeInventory + parseInt(entreearr[i]);
        }
        getEntreeInventory = getEntreeInventory + ");"
        const entreeInventoryQuantities = await pool.query(getEntreeInventory);
        //res.send(JSON.stringify((entreeInventoryQuantities).rows[0].quantity));

        for (var i = 0; i < drinkarr.length; i ++) {
            if (i != 0) {
                getDrinkInventory = getDrinkInventory + ",";
            }
            getDrinkInventory = getDrinkInventory + parseInt(drinkarr[i]);
        }
        getDrinkInventory = getDrinkInventory + ");"
        const drinkInventoryQuantities = await pool.query(getDrinkInventory);
        allInventory = Object.assign({}, entreeInventoryQuantities.rows, drinkInventoryQuantities.rows);
    }
    catch (errr) {
        console.log(errr);
    }

    //Subtract inventory based on recipes
    var updateInventory;
    var allInventoryLen = parseInt(JSON.stringify(Object.keys(allInventory).length));
    try {
        for (var i = 0; i < allInventoryLen; i++) {
            updateInventory = "UPDATE inventory SET stock = CASE item_name WHEN '" + allInventory[i].item_name + "' THEN stock - " + parseFloat(allInventory[i].quantity) + " ELSE 0 END WHERE inventory.item_name in (" + "'" + allInventory[i].item_name + "'" + ");";
            pool.query(updateInventory);
        }
    }
    catch (erm) {
        console.log(erm);
    }
    res.send("Success!");
});

//REPORTS --------------------------------------------------------------------
app.get('/api/productReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.startTime.split('T');

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

app.get('/api/salesReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.startTime.split('T');

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
            productReport: salesReportRes.rows,
        };

        console.log("Sales Report generated from " + startDate + " to " + endDate + ". Sending json.");
        res.json(salesReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Sales Report Failure :(');
    }
});

app.get('/api/excessReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T'); //Probably need to modify this guy
        let endDateReq = req.query.startTime.split('T');

        const startDate = startDateReq[0] + " " + startDateReq[1] + ":00";
        const endDate = endDateReq[0] + " " + endDateReq[1] + ":00";


        const excessReportRes = await pool.query(`
        
        `);
        
        const excessReport = {
            productReport: excessReportRes.rows,
        };

        console.log("Excess Report generated from " + startDate + " to " + endDate + ". Sending json.");
        res.json(excessReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Excess Report Failure :(');
    }
});

app.get('/api/restockReport', async (req, res) => {
    try {

        const restockReportRes = await pool.query(`
            SELECT item_name, stock FROM inventory WHERE stock <= min_stock_warning
        `);
        
        const restockReport = {
            productReport: restockReportRes.rows,
        };

        console.log("Restock Report generated. Sending json.");
        res.json(restockReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('Restock Report Failure :(');
    }
});

app.get('/api/WSTReport', async (req, res) => {
    try {

        let startDateReq = req.query.startTime.split('T');
        let endDateReq = req.query.startTime.split('T');

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
            productReport: WSTReportRes.rows,
        };

        console.log("WST Report generated from " + startDate + " to " + endDate + ". Sending json.");
        res.json(WSTReport);

    } catch (err) {
        console.error(err);
        res.status(500).send('WST Report Failure :(');
    }
});
//END OF REPORTS -----------------------------------------------------------

function getTimeDate() {
    const time = new Date();
    const year = getYear();
    const day = getDay()
    const month = getMonth();
    const hour = getHour();
    const minute = getMinute();
    const second = getSecond();
    return(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
}

function getYear() {
    const time = new Date();
    return time.getFullYear();
}

function getMonth() {
    const time = new Date();
    return time.getMonth() + 1;
}

Date.prototype.getWeek = function() {
    var start = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - start) / 86400000) + start.getDay() + 1) / 7);
}

function getDay() {
    const time = new Date();
    return time.toLocaleString("en-US", { day : '2-digit'})
}

function getHour() {
    const time = new Date();
    return time.getHours();
}

function getMinute() {
    const time = new Date();
    return time.getMinutes();
}

function getSecond() {
    const time = new Date();
    return time.getSeconds();
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
