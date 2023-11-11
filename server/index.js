const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { all } = require('axios');
const dotenv = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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
        const drinkRes = await pool.query('SELECT drink_name, price FROM drinks');

        const menu = {
            entrees: entreeRes.rows,
            drinks: drinkRes.rows
        };

        console.log("Query successful. Sending json.");

        res.json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query Failure :(');
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
