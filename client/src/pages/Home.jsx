import React from 'react'
import '../styles/Home.css';
import '../styles/Home_HC.css';
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

function Home({ isHighContrast }) {
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
        <div class={"homeTop" + (isHighContrast ? "-HC" : "")}>
          <ImageReel foodImages={imageReelImages} scrollInterval={3500} userName = {user?.name} isHighContrast={isHighContrast}/>
        </div>
        <div class={"lowerGrid" + (isHighContrast ? "-HC" : "")}>
          <div class={"leftPanel" + (isHighContrast ? "-HC" : "")}>
            <h2 class={"homeContentTitle" + (isHighContrast ? "-HC" : "")}>Hours of Operation</h2>
            <h3 class={"homeContentHours" + (isHighContrast ? "-HC" : "")}>Mon-Wed: 3pm-11pm*</h3>
            <h3 class={"homeContentHours" + (isHighContrast ? "-HC" : "")}>Thur: 10am-11pm*</h3>
            <h3 class={"homeContentHours" + (isHighContrast ? "-HC" : "")}>Fri-Sat: 10am-12am*</h3>
            <h3 class={"homeContentHours" + (isHighContrast ? "-HC" : "")}>Sun: 10am-11pm*</h3>
            <h3 class={"homeContentHours" + (isHighContrast ? "-HC" : "")}>*Limited Menu After 10pm</h3>
            <h2 class={"homeContentTitle" + (isHighContrast ? "-HC" : "")}>Happy Hours</h2>
            <h3 class={"homeContentHours" + (isHighContrast ? "-HC" : "")}>Mon-Fri: 3pm-6pm</h3>
            <hr/>
            <h3 class={"homeContentLocationTitle" + (isHighContrast ? "-HC" : "")}>Where to Find Us</h3>
            <p class={"homeContentLocationContent" + (isHighContrast ? "-HC" : "")}>1025 University Dr, Suite 101 College Station, TX 77840</p>
            <p class={"homeContentLocationContent" + (isHighContrast ? "-HC" : "")}>Phone: (979) 704-3275</p>
            <GMap/>
          </div>
          <div class={"rightPanel" + (isHighContrast ? "-HC" : "")}>
            <img class={"aboutMosLogo" + (isHighContrast ? "-HC" : "")} src={logoimg} alt="logo" height="182" width="352" />
            <p class={"aboutMos" + (isHighContrast ? "-HC" : "")}>
              Mo’s Irish Pub is not just another Pub. It’s a place where camaraderie is forged. We don’t just serve beer and drinks. We serve you a culture that is unique. We serve you with liquor and the food that goes with it. It’s not just a pub, it’s an extension of home, community, and family.
            </p>
          </div>
        </div>
        <img class={"moslocationimg" + (isHighContrast ? "-HC" : "")} src={buildingimg} alt="logo" height="100%" width="100%" />
      </div>
  );
}

export default Home;