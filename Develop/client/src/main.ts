import './styles/jass.css';

/*
 * DOM Element Selection
 */

const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon = document.getElementById('weather-img') as HTMLImageElement;
const tempEl = document.getElementById('temp') as HTMLParagraphElement;
const windEl = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl = document.getElementById('humidity') as HTMLParagraphElement;

/*
 * Interfaces for API Responses
 */

interface WeatherData {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

interface City {
  name: string;
  id: string;
}

/*
 * API Calls
 */

const fetchWeather = async (city: string): Promise<void> => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData: WeatherData[] = await response.json();

    console.log('weatherData: ', weatherData);

    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again.');
  }
};

const fetchSearchHistory = async (): Promise<Response> => {
  return fetch('/api/weather/history', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

const deleteCityFromHistory = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting city from history:', error);
  }
};

/*
 * Render Functions
 */

const renderCurrentWeather = (currentWeather: WeatherData): void => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  weatherIcon.alt = iconDescription;
  weatherIcon.className = 'weather-img';

  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: WeatherData[]): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.className = 'col-12';
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  forecast.forEach((day) => renderForecastCard(day));
};

const renderForecastCard = (forecast: WeatherData): void => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  cardTitle.textContent = date;
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  weatherIcon.alt = iconDescription;
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastContainer?.append(col);
};

const renderSearchHistory = async (searchHistory: Response): Promise<void> => {
  const historyList: City[] = await searchHistory.json();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
      return;
    }

    historyList.reverse().forEach((city) => {
      const historyItem = buildHistoryListItem(city);
      searchHistoryContainer.append(historyItem);
    });
  }
};

/*
 * Helper Functions
 */

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.className = 'col-auto';
  card.className = 'forecast-card card text-white bg-primary h-100';
  cardBody.className = 'card-body p-2';
  cardTitle.className = 'card-title';
  tempEl.className = 'card-text';
  windEl.className = 'card-text';
  humidityEl.className = 'card-text';

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  return { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl };
};

const buildHistoryListItem = (city: City): HTMLDivElement => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = document.createElement('div');
  historyDiv.className = 'display-flex gap-2 col-12 m-1';
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*
 * Event Handlers
 */

const handleSearchFormSubmit = (event: SubmitEvent): void => {
  event.preventDefault();
  const search: string = searchInput.value.trim();

  if (!search) {
    alert('City cannot be blank');
    return;
  }

  fetchWeather(search).then(getAndRenderHistory);
  searchInput.value = '';
};

const handleDeleteHistoryClick = (event: MouseEvent): void => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const cityID = JSON.parse(target.dataset.city as string).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*
 * Initial Render
 */

const getAndRenderHistory = (): Promise<void> => fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleDeleteHistoryClick);

getAndRenderHistory();
const createHistoryButton = (name: string): HTMLButtonElement => {
  const button = document.createElement('button');
  button.className = 'btn btn-secondary col-8';
  button.textContent = name;
  button.type = 'button';
  button.addEventListener('click', () => {
    fetchWeather(name);
  });
  return button;
};
const createDeleteButton = (): HTMLButtonElement => {
  const button = document.createElement('button');
  button.className = 'btn btn-danger col-3';
  button.textContent = 'Delete';
  button.type = 'button';
  return button;
};
