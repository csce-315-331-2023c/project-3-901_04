const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
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

app.post('/postid', async (req, res) => {
    const orders = req.body;
    var count = 0;
    var returnarr = [];
    try {
        while (count < 50){
            const element = ((await pool.query("SELECT id, entree_name FROM entrees WHERE entree_name='" + orders[count] + "' UNION SELECT id, drink_name FROM drinks WHERE drink_name='" + orders[count] + "';")));
            (res.send(element.rows[0]));
            count += 1;
        }
    }
    catch (err) {
        res.send(returnarr);
    }
    res.send(returnarr);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
