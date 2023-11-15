import React from 'react'
import '../styles/Home.css'
import Weather from '../components/weather';
//import Map from '../components/Map';

function Home() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user data
  const mapLocation = { lat: 30.623977661132812, lng: -96.33989715576172 };

  return (
      <div>
          <h1>Welcome, {user?.name}!</h1> {/* Display the name */}
          <Weather/>
          {/*
          <Map
            containerElement={<div style={{ height: '400px' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            location={mapLocation}
          />
          */}
      </div>
  );
}

export default Home;