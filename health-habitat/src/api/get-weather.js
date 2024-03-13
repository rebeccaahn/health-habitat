import { getLocation } from "./apple/appleLocationApi";
// import env from "./env.json" assert { type: 'json' };
import env from "./env.json";

// Getting current weather data
export async function getWeather() {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getLocation()["latitude"]}&lon=${getLocation()["longitude"]}&appid=${env.weather_API_key}`);
    let jsonResp = await response.json();
    return jsonResp["weather"][0];
}

// Getting current weather category
export async function getWeatherCategory(currentWeather) {
    return currentWeather["main"];
}

// Getting current weather icon URL
export async function getWeatherIcon(currentWeather) {
    let icon = currentWeather["icon"];
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export async function getTemperature(){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getLocation()["latitude"]}&lon=${getLocation()["longitude"]}&appid=${env.weather_API_key}`);
    let jsonResp = await response.json();
    return jsonResp["main"]["temp"];
}
