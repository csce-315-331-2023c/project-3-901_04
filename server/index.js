const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const User = require('./mongo');
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
