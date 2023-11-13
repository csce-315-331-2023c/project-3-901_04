const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); //enable cors for all routes

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

app.get('/api/recipe', async (req, res) => {

    const menuItem = req.query.requestedItem;
    console.log("Finding recipe for item: ", menuItem);

    try {
        const result = await pool.query("SELECT item_name, quantity FROM (SELECT DISTINCT entree_name, item_name, quantity FROM entreerecipes JOIN entrees ON entrees.id = entreerecipes.entree_id JOIN inventory ON inventory.id = entreerecipes.inventory_id WHERE entree_name = '" + menuItem + "' UNION SELECT DISTINCT drink_name, item_name, quantity FROM drinkrecipes JOIN drinks ON drinks.id = drinkrecipes.drink_id JOIN inventory ON inventory.id = drinkrecipes.inventory_id WHERE drink_name = '" + menuItem + "') AS recipes;");
        console.log('Recipe Query success');
        res.json({ 
            recipe: result.rows 
        });
        console.log(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error executing the query' });
      }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
