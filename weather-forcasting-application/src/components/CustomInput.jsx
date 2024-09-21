import React, { useState } from "react";

const apiKey = "451db31a922095940b8a5b8b38177ad9";

export default function CityDropdown({ onCitySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  const fetchCities = async (query) => {
    if (query.length < 6) {
      setFilteredCities([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.list) {
        setFilteredCities(data.list);
      } else {
        setFilteredCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setFilteredCities([]);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchInput(searchValue);
    fetchCities(searchValue);
  };

  const handleCitySelect = (city) => {
    onCitySelect(city);
    setIsOpen(false);
    setSearchInput("");
    setFilteredCities([]);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchInput("");
    setFilteredCities([]);
  };

  return (
    <div style={{ width: "300px", margin: "0 auto", position: "relative" }}>
      <input
        type="text"
        value={searchInput}
        placeholder="Enter a city name"
        onClick={toggleDropdown}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "3px solid #ccc",
        }}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#fff",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {filteredCities.map((city) => (
              <li
                key={city.id}
                onClick={() => handleCitySelect(city)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
              >
                {city.name}, {city.sys.country}
              </li>
            ))}
          </ul>
          {filteredCities.length === 0 && (
            <p style={{ padding: "10px", textAlign: "center" }}>
              No cities found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
