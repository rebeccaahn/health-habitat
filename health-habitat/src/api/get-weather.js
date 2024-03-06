import { getLocation } from "./appleLocationApi";

var weather_API_key = "";

// Getting current weather data
async function getWeather() {
    let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${getLocation()["latitude"]}&lon=${getLocation()["longitude"]}&appid=${API_key}`);
    let jsonResp = await response.json();
    return jsonResp["current"]["weather"][0];
}

// Getting current weather category
export async function getWeatherCategory() {
    let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${getLocation()["latitude"]}&lon=${getLocation()["longitude"]}&appid=${API_key}`);
    let jsonResp = await response.json();
    return jsonResp["current"]["weather"][0]["main"];
}

// Getting current weather icon URL
export async function getWeatherIcon() {
    let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${getLocation()["latitude"]}&lon=${getLocation()["longitude"]}&appid=${API_key}`);
    let jsonResp = await response.json();
    let icon = jsonResp["current"]["weather"][0]["icon"];
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}