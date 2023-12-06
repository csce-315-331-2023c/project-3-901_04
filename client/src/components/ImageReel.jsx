import React, { useState, useEffect } from 'react';
import '../styles/ImageReel.css';
import '../styles/ImageReel_HC.css';
import Weather from '../components/weather';

/**
 * ImageReel Component - Displays a reel of food images with a weather widget and welcome overlay.
 * @component
 * @param {Object} props - Component properties.
 * @param {string[]} props.foodImages - Array of URLs for food images.
 * @param {number} props.scrollInterval - Interval for scrolling the image reel.
 * @param {string} props.userName - User name for the welcome overlay.
 * @param {boolean} props.isHighContrast - Flag indicating whether high contrast mode is enabled.
 * @returns {JSX.Element} - Rendered component.
 */
const ImageReel = ({ foodImages, scrollInterval, userName, isHighContrast }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to scroll through images
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (foodImages.length - 3));
    }, scrollInterval);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [foodImages.length, scrollInterval]);

  /**
   * Render function for the ImageReel component.
   * @returns {JSX.Element} - Rendered component.
   */
  return (
    <div class={"imageReel" + (isHighContrast ? "-HC" : "")}>
      <div class={"weatherWidget" + (isHighContrast ? "-HC" : "")}><Weather/></div>
      <div
        class={"imageContainer" + (isHighContrast ? "-HC" : "")}
        style={{ transform: `translateX(${-currentIndex * 25}%)` }}
      >
        {foodImages.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} />
        ))}
      </div>
      <div className={"welcomeOverlay" + (isHighContrast ? "-HC" : "")}>Welcome to Mo's, {userName}!</div>
    </div>
  );
};

export default ImageReel;
