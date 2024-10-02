import React from "react";

export default function ForecastCard({ day, highTemp, lowTemp, icon }) {
  return (
    <div className="card">
      <div className="card-body text-center">
        <h5 className="card-title">{day}</h5>
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="Weather icon"
          className="img-fluid"
        />
        <p className="card-text">High: {highTemp}</p>
        <p className="card-text">Low: {lowTemp}</p>
      </div>
    </div>
  );
}

