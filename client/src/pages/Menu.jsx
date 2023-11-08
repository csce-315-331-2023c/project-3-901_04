import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';

function Menu() {
  const [menu, setMenu] = useState({ entrees: [], drinks: [] });

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
    <div className='menu'>
      <div className="entrees">
        <h1>Entrees</h1>
        {menu.entrees.map((entree, index) => (
          <p key={index}>{entree.entree_name}: <b>{entree.price}</b></p>
        ))}
      </div>

      <div className="drinks">
        <h1>Drinks</h1>
        {menu.drinks.map((drink, index) => (
          <p key={index}>{drink.drink_name}: <b>{drink.price}</b></p>
        ))}
      </div>
    </div>
  );
}

export default Menu;