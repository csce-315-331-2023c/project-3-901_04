import React, { useState, useEffect } from 'react';
import '../styles/ImageReel.css';

/**
 * Weather Component - Fetches and displays current weather information based on the geographical location (latitude and longitude).
 * @component
 * @returns {JSX.Element} - Rendered component with current weather details.
 */
const Weather = () => {
    /**
     * State hook to store the geographical coordinates (latitude and longitude).
     */
    const [coords, setCoords] = useState({ lat: null, long: null });
    
    /**
     * State hook to store the current weather data.
     */
    const [weather, setWeather] = useState({ weather: null, setWeather: null });
    
    /**
     * State hook to store the URL of the current weather image.
     */
    const [image, setImg] = useState({ image: null, setImg: null });
    
    /**
     * State hook to store the future weather data.
     */
    const [futureWeather, setFutureW] = useState({ futureWeather: null, setFutureW: null });
    
    /**
     * State hook to store the URL of the future weather image.
     */
    const [futureImage, setFutureI] = useState({ futureImage: null, setFutureI: null });

    /**
     * Fetches the current location's coordinates and sets the state.
     */
    useEffect(() => {
        setCoords({
            lat: 30.623835,
            long: -96.339995
        });
    }, []);

    /**
     * Fetches current and future weather data based on the coordinates and updates the state.
     */
    useEffect(() => {
        if (coords.lat && coords.long) {
            const getData = async () => {
                try {
                    // Fetches current weather data
                    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + coords.lat + '&lon=' + coords.long + '&appid=b957bc70a33ca6ee14b39bd6e8b76a53&units=metric');
                    const data = await response.json();
                    setWeather(data);

                    // Fetches the URL of the current weather image
                    const imgResponse = await fetch('https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
                    const imgBlob = await imgResponse.blob();
                    const imgObj = URL.createObjectURL(imgBlob);
                    setImg(imgObj);

                    // Fetches future weather data
                    const futureResponse = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + coords.lat + '&lon=' + coords.long + '&appid=b957bc70a33ca6ee14b39bd6e8b76a53&units=metric');
                    const futureData = await futureResponse.json();
                    setFutureW(futureData);

                    // Fetches the URL of the future weather image

                } catch (error) {
                    console.error(error);
                }
            };
            getData();
        }
    }, [coords]);

    /**
     * Renders the weather component with current weather details.
     */
    return (
        <div>
            {(typeof (weather.name) != 'undefined' && weather.name != null) ? (
                <div class="weatherBox">
                    <div>
                        <p>{Math.round(celToFah(weather.main.temp))}°F/{Math.round(weather.main.temp)}°C</p>
                        <p>{(weather.weather[0].description).charAt(0).toUpperCase() + (weather.weather[0].description).slice(1)}</p>
                    </div>
                    <div>
                        <img src={image} alt="Current Weather" />
                    </div>
                </div>
            ) : (
                <h3>loading...</h3>
            )}
        </div>
    )
}

export default Weather;

/**
 * Converts temperature from Celsius to Fahrenheit.
 * @param {number} cel - Temperature in Celsius.
 * @returns {number} - Temperature in Fahrenheit.
 */
function celToFah(cel) {
    return (9 / 5) * cel + 32;
}
