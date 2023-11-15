import React from 'react'
import '../styles/Home.css'
import Weather from '../components/weather';
import GoogleMapsComponent from '../components/GoogleMapsComponent';

function Home() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user data

  return (
      <div>
          <h1>Welcome, {user?.name}!</h1> {/* Display the name */}
          <Weather/>
          <GoogleMapsComponent/>
      </div>
  );
}

export default Home;