import { getLocation } from "./appleLocationApi";
import env from "./env.json" assert { type: 'json' };

// Getting current weather data
async function getWeather() {
    let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${getLocation()["latitude"]}&lon=${getLocation()["longitude"]}&appid=${env.weather_API_key}`);
    let jsonResp = await response.json();
    return jsonResp["current"]["weather"][0];
}

// Getting current weather category
export async function getWeatherCategory(currentWeather) {
    return currentWeather["main"];
}

// Getting current weather icon URL
export async function getWeatherIcon(jsonResp) {
    let icon = currentWeather["icon"];
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}