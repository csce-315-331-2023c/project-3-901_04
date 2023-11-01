import React, { useState, useEffect } from 'react';
import '../styles/AccessibilityWidget.css'
import geoloc from "react-geolocated";


const Weather = () => {

    console.log("called");
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);

    navigator.geolocation.getCurrentPosition(function(position) {
        setLong(position.coords.longitude);
        setLat(position.coords.latitude);
        console.log("position: ");
        console.log(long);
        console.log(lat);
    }) 

    useEffect(() => {
        const getData = async() => {

            await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=b957bc70a33ca6ee14b39bd6e8b76a53&units=metric')
            .then(response => response.json())
            .then(data => {
                setWeather(data);
                setLocation(data.main);
                console.log("weather data: ");
                console.log(data.main);
            })
            .catch(error => console.log(error));
        }
        getData();
    }, [lat, long])


    return (

        <div>
            {(typeof weather.name != 'undefined') ? (
                <div>
                <p>Location: {weather.name}</p>
                <p>Temperature: {weather.main.temp} °C</p>
                <p>Weather: {weather.weather[0].description}</p>
                </div>
            ): (
                <div>loading</div>
            )}
        </div>
        /*<div className = "app">
            <h1 className = "Weather">
                Weather
            </h1>
            {weather.error && (
                <p> NOT FOUND</p>
            )}
            {weather && weather.data && (
                <p>FOUND</p>
            )}
        </div>*/
        /*<div>
            {weather ?(
                <>
                <h2>{weather.name}</h2>
                <p>testing</p>
                </>
            ) : (
                <p>Loading</p>
            )}

            {lat ?(
                <>
                <h2>{lat.main}</h2>
                <p>testing2</p>
                </>
            ) : (
                <p>Loading</p>
            )}
        </div>*/

    )
}

export default Weather;