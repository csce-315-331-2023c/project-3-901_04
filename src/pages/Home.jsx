import React from 'react'
import '../styles/Home.css'
import Weather from '../components/weather';

function Home() {
  return (
    <div className='home'>
      <h>Weather</h>
      <Weather/>
      <div>Home, with NodeJS backend</div>
    </div>


  )
}

export default Home;
