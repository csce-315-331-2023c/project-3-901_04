import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import '../styles/Menu_HC.css';

function Menu({ isHighContrast }) {
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
    <div class={'menu' + (isHighContrast ? "-HC" : "")}>

      <div class={"entrees" + (isHighContrast ? "-HC" : "")}>
        <h1 class={"menuHeader" + (isHighContrast ? "-HC" : "")}>Entrees</h1>
        {menu.entrees.map((entree, index) => (
          <p class={"entreeName" + (isHighContrast ? "-HC" : "")} key={index}>{(entree.entree_name).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{entree.price}</b></p>
        ))}
      </div>

      <div class={"drinksLeft" + (isHighContrast ? "-HC" : "")}>

        <h1 class={"menuHeader" + (isHighContrast ? "-HC" : "")}>Drinks</h1>

        <h2 class={"menuSubHeader" + (isHighContrast ? "-HC" : "")}>Draft</h2>
        {menu.draft.map((drink, index) => (
          <p class={"drinkName" + (isHighContrast ? "-HC" : "")} key={index}>{(drink[0]).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{drink[1]}</b></p>
        ))}

        <div class={"happyHourFooter" + (isHighContrast ? "-HC" : "")}>
        <p>*Happy Hour Price $2.92/beer</p>
        <p>Mon-Fri 3 to 6pm</p>
        </div>

        <h2 class={"menuSubHeader" + (isHighContrast ? "-HC" : "")}>Bottled</h2>
        {menu.bottled.map((drink, index) => (
          <p class={"drinkName" + (isHighContrast ? "-HC" : "")} key={index}>{(drink[0]).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{drink[1]}</b></p>
        ))}

      </div>

      <div class={"drinksRight" + (isHighContrast ? "-HC" : "")}>

        <h2 class={"menuSubHeader" + (isHighContrast ? "-HC" : "")}>Wine</h2>
        {menu.wine.map((drink, index) => (
          <p class={"drinkName" + (isHighContrast ? "-HC" : "")} key={index}>{(drink[0]).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{drink[1]}</b></p>
        ))}

        <div class={"happyHourFooter" + (isHighContrast ? "-HC" : "")}>
        <p>*Happy Hour Price $5/glass</p>
        <p>Mon-Fri 3 to 6pm</p>
        </div>

        <h2 class={"menuSubHeader" + (isHighContrast ? "-HC" : "")}>Cocktails</h2>
        {menu.cocktails.map((drink, index) => (
          <p class={"drinkName" + (isHighContrast ? "-HC" : "")} key={index}>{(drink[0]).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{drink[1]}</b></p>
        ))}

        <h2 class={"menuSubHeader" + (isHighContrast ? "-HC" : "")}>Brunch</h2>
        {menu.brunchDrinks.map((drink, index) => (
          <p class={"drinkName" + (isHighContrast ? "-HC" : "")} key={index}>{(drink[0]).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{drink[1]}</b></p>
        ))}

        <h2 class={"menuSubHeader" + (isHighContrast ? "-HC" : "")}>Non Alcoholic</h2>
        {menu.noAlch.map((drink, index) => (
          <p class={"drinkName" + (isHighContrast ? "-HC" : "")} key={index}>{(drink[0]).toUpperCase()}: <b class={"prices" + (isHighContrast ? "-HC" : "")}>{drink[1]}</b></p>
        ))}

      </div>


    </div>
  );
}

export default Menu;
