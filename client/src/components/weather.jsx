import React, { useState, useEffect } from 'react';
import '../styles/AccessibilityWidget.css';

/**
 * This function takes the geological location of Mo's (or the user) and queries the weather for it.
 * This function then formats the weather data and exports it to a calling function.
 * @returns HTML
 */
const Weather = () => {
    const [coords, setCoords] = useState({ lat: null, long: null });
    const [weather, setWeather] = useState({weather: null, setWeather : null});
    const [image, setImg] = useState({image: null, setImg: null});
    const [futureWeather, setFutureW] = useState({futureWeather: null, setFutureW : null});
    const [futureImage, setFutureI] = useState({futureImage: null, setFutureI: null});

    useEffect(() => {
        /*navigator.geolocation.getCurrentPosition(position => {
            setCoords({
                lat: position.coords.latitude,
                long: position.coords.longitude
            });
        });*/
        setCoords({
            lat: 30.623835,
            long: -96.339995
        })
    }, []);

    useEffect(() => {
        if (coords.lat && coords.long) {
            const getData = async () => {
                try {
                    //gets current weather
                    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + coords.lat + '&lon=' + coords.long + '&appid=b957bc70a33ca6ee14b39bd6e8b76a53&units=metric');
                    const data = await response.json();
                    setWeather(data);
                    console.log("weather data: ", data.main);
                    console.log("weather id: ", data.weather[0].icon );

                    //gets current weather image
                    const imgResponse = await fetch('https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'); 
                    const imgBlob = await imgResponse.blob();
                    const imgObj = URL.createObjectURL(imgBlob);
                    setImg(imgObj);

                    //gets forecast
                    const futureResponse = await fetch('api.openweathermap.org/data/2.5/forecast?lat=' + coords.lat + '&lon=' + coords.long +  '&appid=b957bc70a33ca6ee14b39bd6e8b76a53&units=metric');
                    const futureData = await futureResponse.json();
                    setFutureW(futureData);
                    console.log("future weather data: ", futureData.list[0].main);
                    //gets future weather image


                } catch (error) {
                    console.error(error);
                }
            };
            getData();
        }
    }, [coords]);

    return (
        <div>
            {(typeof(weather.name) != 'undefined' && weather.name != null) ? (
                <div>
                <p>Location: {weather.name}</p>
                <p>Temperature: {Math.round(celToFah(weather.main.temp))}°F/{Math.round(weather.main.temp)}°C</p>
                <img src={image}/>
                <p>Weather: {weather.weather[0].description}</p>
                </div>
            ): (
                <h>loading...</h>
            )}
        </div>
    )
}

export default Weather;

/**
 * This function takes in a temperature in Celsius and returns its equivalent value in Fahrenheit.
 * @param {*} cel 
 * @returns the temperature in fahrenheit
 */
function celToFah(cel) {
    return (9/5) * cel + 32;
}