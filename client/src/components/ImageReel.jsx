import React, { useState, useEffect } from 'react';
import '../styles/ImageReel.css';
import Weather from '../components/weather';

const ImageReel = ({ foodImages, scrollInterval, userName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
    
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (foodImages.length - 3));
    }, scrollInterval);

    return () => clearInterval(intervalId);
  }, [foodImages.length, scrollInterval]);


  
  return (
    <div class="imageReel">
      <div class="weatherWidget"><Weather/></div>
      <div
        class="imageContainer"
        style={{ transform: `translateX(${-currentIndex * 25}%)` }}
      >
        {foodImages.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} />
        ))}
      </div>
      <div className="welcomeOverlay">Welcome to Mo's, {userName}!</div>
    </div>
  );
};

export default ImageReel;