import React, { useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;

export default function CityDropdown({ onCitySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

 /**
 * Fetches cities from the OpenWeatherMap API based on the search query provided by the user.
 * If the query is too short or an error occurs, it clears the filtered cities list.
 * 
 * @async
 * @function fetchCities
 * @param {string} query - The city name or part of the city name to search for.
 * @returns {void} Updates the filtered cities state with matching cities or an empty list on error.
 */

  const fetchCities = async (query) => {
    if (query.length < 2) {
      setFilteredCities([]);
      return;
    }


    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`
      );

      const data = await response.json();
      console.log(data);

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

/**
 * Handles changes in the search input field, updating the input value and triggering a city search.
 * 
 * @function handleSearchChange
 * @param {Event} e - The input event generated when the user types in the search bar.
 * @returns {void} Fetches cities based on the updated input.
 */

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchInput(searchValue);
    fetchCities(searchValue);
  };
  /**
 * Handles the selection of a city from the dropdown, triggering an action (e.g., displaying weather).
 * It also clears the dropdown and search input after selection.
 * 
 * @function handleCitySelect
 * @param {Object} city - The selected city object containing city information.
 * @returns {void} Updates the state with the selected city and closes the dropdown.
 */
  const handleCitySelect = (city) => {
    onCitySelect(city);
    setIsOpen(false);
    setSearchInput("");
    setFilteredCities([]);
  };
  /**
 * Toggles the dropdown visibility on and off, allowing the user to view or hide the city list.
 * Clears the filtered cities list when closed.
 * 
 * @function toggleDropdown
 * @returns {void} Toggles the open state of the dropdown and clears any listed cities when closed.
 */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
