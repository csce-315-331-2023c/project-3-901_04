const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();

// Setup CORS
app.use(cors()); // enable cors for all routes

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
});

app.get('/api', (req, res) => {
    res.send('Mos Irish Pub Backend!');
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
        res.status(500).send("Server Error");
    }
});

module.exports = app;
