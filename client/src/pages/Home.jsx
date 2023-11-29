import React from 'react'
import '../styles/Home.css';
import GMap from '../components/Map';
import ImageReel from '../components/ImageReel';
import bakedpasta from '../media/foodPhotos/bakedpasta.png';
import biscuits from '../media/foodPhotos/biscuits.png';
import burger from '../media/foodPhotos/burger.png';
import cheesecake from '../media/foodPhotos/cheesecake.png';
import chipsandsalsa from '../media/foodPhotos/chipsandsalsa.png';
import dessert from '../media/foodPhotos/dessert.png';
import friedjalapeno from '../media/foodPhotos/friedjalapeno.png';
import grilledchicken from '../media/foodPhotos/grilledchicken.png';
import loadedfries from '../media/foodPhotos/loadedfries.jpg';
import mozzerellasticks from '../media/foodPhotos/mozzerellasticks.png';
import multipleburgers from '../media/foodPhotos/multipleburgers.jpg';
import nachos from '../media/foodPhotos/nachos.png';
import pancake from '../media/foodPhotos/pancake.png';
import pasta from '../media/foodPhotos/pasta.png';
import potatoesandavocado from '../media/foodPhotos/potatoesandavocado.png';
import quesadias from '../media/foodPhotos/quesadias.png';
import sandwich from '../media/foodPhotos/sandwich.png';
import sandwich2 from '../media/foodPhotos/sandwich2.png';
import steak from '../media/foodPhotos/steak.png';
import tenders from '../media/foodPhotos/tenders.png';
import logoimg from '../media/mos.svg';
import buildingimg from '../media/moslocation.jpg';

function Home() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user data

  const imageReelImages = [
    bakedpasta,
    biscuits,
    burger,
    cheesecake,
    chipsandsalsa,
    dessert,
    friedjalapeno,
    grilledchicken,
    loadedfries,
    mozzerellasticks,
    multipleburgers,
    nachos,
    pancake,
    pasta,
    potatoesandavocado,
    quesadias,
    sandwich,
    sandwich2,
    steak,
    tenders
  ];


  return (
      <div>
        <div class="homeTop">
          <ImageReel foodImages={imageReelImages} scrollInterval={3500} userName = {user?.name} />
        </div>
        <div class="lowerGrid">
          <div class="leftPanel">
            <h2 class="homeContentTitle">Hours of Operation</h2>
            <h3>Mon-Wed: 3pm-11pm*</h3>
            <h3>Thur: 10am-11pm*</h3>
            <h3>Fri-Sat: 10am-12am*</h3>
            <h3>Sun: 10am-11pm*</h3>
            <h3>*Limited Menu After 10pm</h3>
            <h2 class="homeContentTitle">Happy Hours</h2>
            <h3>Mon-Fri: 3pm-6pm</h3>
            <hr/>
            <h3>Where to Find Us</h3>
            <p>1025 University Dr, Suite 101 College Station, TX 77840</p>
            <p>Phone: (979) 704-3275</p>
            <GMap/>
          </div>
          <div class="rightPanel">
            <img class="aboutMosLogo" src={logoimg} alt="logo" height="182" width="352" />
            <p class="aboutMos">
              Mo’s Irish Pub is not just another Pub. It’s a place where camaraderie is forged. We don’t just serve beer and drinks. We serve you a culture that is unique. We serve you with liquor and the food that goes with it. It’s not just a pub, it’s an extension of home, community, and family.
            </p>
          </div>
        </div>
        <img class="moslocationimg" src={buildingimg} alt="logo" height="100%" width="100%" />
      </div>
  );
}

export default Home;