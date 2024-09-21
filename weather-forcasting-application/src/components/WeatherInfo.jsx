import { useState } from "preact/hooks";
import React from "react";
import CityDropdown from "./CustomInput";
import ForecastCard from "./ForcastCard"; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

export default function WeatherInfo() {
  const [weatherData, setWeather] = useState(null);
  const [forecastData, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  const apiKey = {
    key: "451db31a922095940b8a5b8b38177ad9",
    baseWeather: "https://api.openweathermap.org/data/2.5/weather",
    baseForecast: "https://api.openweathermap.org/data/2.5/forecast",
  };

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

  const handleCitySelect = (city) => {
    handleClick(city.name);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
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
              {convertTemperature(weatherData.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}
            </h2>
            <p className="card-text">
              {weatherData.weather[0].main} - {weatherData.weather[0].description}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <button className="btn btn-primary mt-3" onClick={toggleTemperatureUnit}>
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
              highTemp={convertTemperature(day.main.temp_max).toFixed(1)}
              lowTemp={convertTemperature(day.main.temp_min).toFixed(1)}
              icon={day.weather[0].icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

