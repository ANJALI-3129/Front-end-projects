const API_KEY = "f28283a7d65ca6d65dd3c4450543a0e2";

const defaultCity = document.getElementById("default-city");
const defaultTemp = document.getElementById("default-temp");
const detailsCard = document.getElementById("details-card");
const detailsBtn = document.getElementById("detail-btn");
const cityInput = document.getElementById("city-input");
const searchArea = document.getElementById("search-area");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const weatherDesc = document.getElementById("weather-desc");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastContainer = document.getElementById("forecast-container");
const InputForm = document.getElementsByClassName("input-form");

// show second card on "see deatils" click
detailsBtn.addEventListener("click", function () {
  detailsCard.style.display = "block";
  searchArea.style.display = "block";
  cityInput.value = "";
});

searchBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  getWeatherByCity(city, true);
  searchArea.style.display = "none";
});
// on page load get user Location
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation not supported.");
  }
};
// fetch weather by coordinates
function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherByCoords(lat, lon, true); // true = update default card
}

function error() {
  alert("Could not get location. Defaulting to Delhi.");
  getWeatherByCity("Delhi", true);
}

// Fetch weather using coordinates
async function getWeatherByCoords(lat, lon, updateFirstCard = false) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (updateFirstCard) updateDefaultCard(data);
  } catch (err) {
    console.error("Error fetching weather by coordinates:", err);
  }
}
// Update UI of the default weather card
function updateDefaultCard(data) {
  defaultCity.textContent = data.name;
  defaultTemp.textContent = `${data.main.temp}°C`;
}

//  Get weather by city (used in 2nd card)
async function getWeatherByCity(city, showDetails = false) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (showDetails) updateDetailsCard(data);
    getForecast(city);
  } catch (err) {
    console.log("Error fetching city weather: ", err);
    alert("City not found");
  }
}
// update the second card's info
function updateDetailsCard(data) {
  cityName.textContent = data.name;
  weatherDesc.textContent = data.weather[0].description;
  temp.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;

  wind.textContent = `Wind Speed : ${data.wind.speed}m/s`;
}
//  Fetch 5-day forecast
async function getForecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    forecastContainer.innerHTML = ""; // Clear old forecast

    // One forecast per day (12:00:00)
    const dailyData = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    dailyData.forEach((item) => {
      const date = new Date(item.dt_txt).toDateString();
      const forecastDiv = document.createElement("div");
      forecastDiv.innerHTML = `
        <strong>${date}</strong><br/>
        ${item.weather[0].main}, ${item.main.temp}°C
        <hr/>
      `;
      forecastContainer.appendChild(forecastDiv);
    });
  } catch (err) {
    console.error("Error fetching forecast:", err);
  }
}

// Handle search button
searchBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  getWeatherByCity(city, true);
});
