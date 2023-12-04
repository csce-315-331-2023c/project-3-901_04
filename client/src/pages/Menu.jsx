import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';

function Menu() {
  const [menu, setMenu] = useState({ entrees: [], draft: [],  bottled: [], wine: [], cocktails: [], noAlch: [], brunchDrinks: []});

  useEffect(() => {

    const backendURL = process.env.NODE_ENV === 'production'
      ? 'https://mos-irish-server-901-04.vercel.app/api/menu'
      : 'http://localhost:3001/api/menu';
    fetch(backendURL) //backend url
      .then(res => res.json())
      .then(data => {
        setMenu(data);
      });
    
  }, []);

  return (
    <div class='menu'>

      <div class="entrees">
        <h1 class="menuHeader">Entrees</h1>
        {menu.entrees.map((entree, index) => (
          <p class="entreeName" key={index}>{(entree.entree_name).toUpperCase()}: <b class="prices">{entree.price}</b></p>
        ))}
      </div>

      <div class="drinksLeft">

        <h1 class="menuHeader">Drinks</h1>

        <h2 class="menuSubHeader">Draft</h2>
        {menu.draft.map((drink, index) => (
          <p class="drinkName" key={index}>{(drink[0]).toUpperCase()}: <b class="prices">{drink[1]}</b></p>
        ))}

        <div class="happyHourFooter">
        <p>*Happy Hour Price $2.92/beer</p>
        <p>Mon-Fri 3 to 6pm</p>
        </div>

        <h2 class="menuSubHeader">Bottled</h2>
        {menu.bottled.map((drink, index) => (
          <p class="drinkName" key={index}>{(drink[0]).toUpperCase()}: <b class="prices">{drink[1]}</b></p>
        ))}

      </div>

      <div class="drinksRight">

        <h2 class="menuSubHeader">Wine</h2>
        {menu.wine.map((drink, index) => (
          <p class="drinkName" key={index}>{(drink[0]).toUpperCase()}: <b class="prices">{drink[1]}</b></p>
        ))}

        <div class="happyHourFooter">
        <p>*Happy Hour Price $5/glass</p>
        <p>Mon-Fri 3 to 6pm</p>
        </div>

        <h2 class="menuSubHeader">Cocktails</h2>
        {menu.cocktails.map((drink, index) => (
          <p class="drinkName" key={index}>{(drink[0]).toUpperCase()}: <b class="prices">{drink[1]}</b></p>
        ))}

        <h2 class="menuSubHeader">Brunch</h2>
        {menu.brunchDrinks.map((drink, index) => (
          <p class="drinkName" key={index}>{(drink[0]).toUpperCase()}: <b class="prices">{drink[1]}</b></p>
        ))}

        <h2 class="menuSubHeader">Non Alcoholic</h2>
        {menu.noAlch.map((drink, index) => (
          <p class="drinkName" key={index}>{(drink[0]).toUpperCase()}: <b class="prices">{drink[1]}</b></p>
        ))}

      </div>


    </div>
  );
}

export default Menu;
