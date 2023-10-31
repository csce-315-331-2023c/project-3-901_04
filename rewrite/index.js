const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: false
});

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(404);
});

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const data = {name: 'Mo\'s Irish Pub'};
    res.render('index', data);
});

app.get('/menu', (req, res) => {
    entreeMenu = []
    drinkMenu = []
    pool
        .query('SELECT entree_name, price FROM entrees WHERE togo = false;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; i++){
                entreeMenu.push(query_res.rows[i]);
            }
            const data = {entreeMenu: entreeMenu};
            console.log(entreeMenu);
        });
    pool    
        .query('SELECT drink_name, price FROM drinks')
        .then(query_res => {
            for(let j = 0; j < query_res.rowCount; j++){
                drinkMenu.push(query_res.rows[j]);
            }
            const data = {drinkMenu: drinkMenu};
            console.log(drinkMenu);
            res.render('menu', {entreeMenu, drinkMenu});
        });
    
        
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
