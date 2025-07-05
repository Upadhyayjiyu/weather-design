const apiKey = '063fa277d32e89333a0443d4e2693320';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const details = document.getElementById('details');
const weatherIcon = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecast');
const weatherAlert = document.getElementById('weatherAlert');
const modeToggle = document.getElementById('modeToggle');

searchBtn.addEventListener('click', () => {
  getWeather(cityInput.value.trim());
});

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

async function getWeather(city) {
  if (!city) return;

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp} °C`;
    details.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} km/h | Feels like: ${data.main.feels_like} °C`;

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.src = icon;

    changeBackground(data.weather[0].main);

    if (["Thunderstorm", "Extreme"].includes(data.weather[0].main)) {
      weatherAlert.textContent = "⚠️ Storm Warning!";
    } else {
      weatherAlert.textContent = "";
    }

    getForecast(city);

  } catch (error) {
    console.error(error);
    cityName.textContent = "Not Found";
    temperature.textContent = "- °C";
    details.textContent = "";
    weatherIcon.src = "";
    forecastContainer.innerHTML = "";
    weatherAlert.textContent = "Could not find weather data.";
  }
}

async function getForecast(city) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await res.json();

  forecastContainer.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const dayData = data.list[i];
    const date = new Date(dayData.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
    const icon = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
    const temp = `${dayData.main.temp}°C`;

    const div = document.createElement('div');
    div.classList.add('forecast-day');
    div.innerHTML = `<h4>${date}</h4><img src="${icon}" alt=""><p>${temp}</p>`;
    forecastContainer.appendChild(div);
  }
}

function changeBackground(condition) {
  let url = "";
  switch (condition) {
    case "Clear": url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb"; break;
    case "Clouds": url = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29"; break;
    case "Rain": url = "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6"; break;
    case "Snow": url = "https://images.unsplash.com/photo-1608889176870-cc49b614d2ec"; break;
    case "Thunderstorm": url = "https://images.unsplash.com/photo-1500674425229-f692875b0ab7"; break;
    default: url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
  }
  document.body.style.background = `url('${url}') center/cover no-repeat`;
}
