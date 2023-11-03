import React from 'react'
import '../styles/Home.css'
import Weather from '../components/weather';

function Home() {
  return (
    <div className='home'>
      <Weather/>
    </div>
  )
}

export default Home;
