import { useState } from "preact/hooks";
import React from "react";
import CityDropdown from "./CustomInput";
import ForecastCard from "./ForcastCard";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WeatherInfo() {
  const [weatherData, setWeather] = useState(null);
  const [forecastData, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [unit, setUnit] = useState("C°");
  let tempUnit = unit;
  const apiKey = {
    key: import.meta.env.VITE_API_KEY,
    baseWeather: "https://api.openweathermap.org/data/2.5/weather",
    baseForecast: "https://api.openweathermap.org/data/2.5/forecast",
  };
  /**
 * Fetches current weather and 5-day forecast data for a given city.
 * 
 * This function makes two API calls:
 * 1. Fetches current weather data from the OpenWeatherMap API using the city name.
 * 2. Fetches the 5-day weather forecast (with 3-hour intervals) for the same city.
 * 
 * The weather and forecast data are updated in the state. If there's an error (e.g., invalid city or network issue), 
 * it logs the error to the console.
 * 
 * @param {string} city - The name of the city to fetch weather data for.
 * 
 * @example
 * handleClick("New York");
 */
   const handleClick = (city) => {
    fetch(`${apiKey.baseWeather}?q=${city}&units=metric&appid=${apiKey.key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((result) => {
        if (result.cod !== 200) {
          throw new Error(result.message);
        }
        setWeather(result);
        return fetch(
          `${apiKey.baseForecast}?q=${city}&units=metric&appid=${apiKey.key}`
        );
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((forecastResult) => {
        if (forecastResult.cod !== "200") {
          throw new Error(forecastResult.message);
        }

        const uniqueDays = {};
        const filteredForecast = forecastResult.list.filter((day) => {
          const date = new Date(day.dt * 1000).toLocaleDateString();
          if (!uniqueDays[date]) {
            uniqueDays[date] = true;
            return true;
          }
          return false;
        });
        setForecast(filteredForecast);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
      });
  };

  /**
 * Handles the selection of a city from the city search component.
 *
 * @param {Object} city - The city object containing the name of the selected city.
 */

  const handleCitySelect = (city) => {
    handleClick(city.name);
  };

  /**
 * Toggles the temperature unit between Celsius and Fahrenheit.
 */

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  /**
   * Converts a given temperature from Celsius to Fahrenheit or vice versa based on the current unit.
   *
   * @param {number} temp - The temperature value to be converted.
   * @returns {string} - The converted temperature followed by the unit (either "F°" or "C°").
   *
   * @description
   * If the current temperature unit is in Celsius, the function converts the value to Fahrenheit,
   * appends the "F°" unit, and returns the result. If the unit is already in Fahrenheit, the original
   * Celsius value is returned with the "C°" unit appended.
   *
   * @example
   * const tempInFahrenheit = convertTemperature(25); // returns '77F°'
   * const tempInCelsius = convertTemperature(77); // returns '77C°' if `isCelsius` is true
   */
  const convertTemperature = (temp) => {
    if (!isCelsius) {
      let convertedTemperature = Math.round((temp * 9) / 5 + 32).toString();
      setUnit("F°");
      return convertedTemperature + unit;
    } else {
      setUnit("C°");
    }
    return isCelsius ? temp + unit : "";
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12 col-md-6 offset-md-3">
          <CityDropdown onCitySelect={handleCitySelect} />
        </div>
      </div>

      {weatherData ? (
        <div className="card mb-4 text-center shadow-lg">
          <div className="card-body">
            <h1 className="card-title">{weatherData.name}</h1>
            <h2 className="card-subtitle mb-2">
              {convertTemperature(Math.round(weatherData.main.temp))}
            </h2>
            <p className="card-text">
              {weatherData.weather[0].main} -{" "}
              {weatherData.weather[0].description}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <button
              className="btn btn-primary mt-3"
              onClick={toggleTemperatureUnit}
            >
              Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No weather data available</p>
      )}

      <h3 className="text-center">5-Day Forecast</h3>
      <div className="row">
        {forecastData.map((day, index) => (
          <div key={index} className="col-12 col-md-4 mb-4">
            <ForecastCard
              day={new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long",
              })}
              highTemp={convertTemperature(Math.round(day.main.temp_max))}
              lowTemp={convertTemperature(Math.round(day.main.temp_min))}
              icon={day.weather[0].icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
