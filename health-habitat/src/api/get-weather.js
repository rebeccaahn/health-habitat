import { getLocation } from "./apple/appleLocationApi";
// import env from "./env.json" assert { type: 'json' };
import env from "./env.json";

// Getting current weather data
export async function getWeather() {
    let location = await getLocation();
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location["latitude"]}&lon=${location["longitude"]}&appid=${env.weather_API_key}`);
    let jsonResp = await response.json();
    console.log("weather", jsonResp);
    return jsonResp["weather"][0];
}

// Getting current weather category
export async function getWeatherCategory(currentWeather) {
    let result = await currentWeather["main"]
    return result;
}

// Getting current weather icon URL
export async function getWeatherIcon(currentWeather) {
    let icon = await currentWeather["icon"];
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export async function getTemperature(){
    let location = await getLocation();
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location["latitude"]}&lon=${location["longitude"]}&appid=${env.weather_API_key}`);
    let jsonResp = await response.json();
    let result = jsonResp["main"]["temp"]
    return result;
}
