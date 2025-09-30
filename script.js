class WeatherApp {
    constructor() {
        this.apiKey = "API-KEY";
        this.baseURL = 'https://api.openweathermap.org/data/2.5';
        this.geocodingURL = 'https://api.openweathermap.org/geo/1.0';
        
        this.initializeElements();
        this.bindEvents();
        this.loadDefaultWeather();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.loading = document.getElementById('loading');
        this.weatherCard = document.getElementById('weatherCard');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.forecastList = document.getElementById('forecastList');
        
        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.country = document.getElementById('country');
        this.date = document.getElementById('date');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.temperature = document.getElementById('temperature');
        this.description = document.getElementById('description');
        this.visibility = document.getElementById('visibility');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.feelsLike = document.getElementById('feelsLike');
        this.pressure = document.getElementById('pressure');
        this.uvIndex = document.getElementById('uvIndex');
        this.errorText = document.getElementById('errorText');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.locationBtn.addEventListener('click', () => this.getCurrentLocationWeather());
        this.retryBtn.addEventListener('click', () => this.searchWeather());
        
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }

    async loadDefaultWeather() {
        // Test API key first
        if (!await this.testApiKey()) {
            this.showError('API key is invalid or not activated. Please check your OpenWeather API key.');
            return;
        }
        
        // Load weather for London as default
        await this.getWeatherByCity('London');
    }

    async testApiKey() {
        try {
            const testUrl = `${this.baseURL}/weather?q=London&appid=${this.apiKey}&units=metric`;
            console.log('Testing API key with URL:', testUrl);
            
            const response = await fetch(testUrl);
            console.log('API key test response status:', response.status);
            
            if (response.status === 401) {
                console.error('API key is invalid (401 Unauthorized)');
                console.log('Please get a new API key from: https://openweathermap.org/api');
                console.log('Note: New API keys can take up to 2 hours to activate');
                return false;
            }
            
            if (response.status === 403) {
                console.error('API key access forbidden (403 Forbidden)');
                return false;
            }
            
            if (response.status === 429) {
                console.error('API rate limit exceeded (429 Too Many Requests)');
                return false;
            }
            
            return response.ok;
        } catch (error) {
            console.error('Error testing API key:', error);
            console.log('This might be a CORS issue. Try running from a local server.');
            return false;
        }
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        await this.getWeatherByCity(city);
    }

    async getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                let errorMsg = 'Unable to get your location';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Location request timed out';
                        break;
                }
                this.showError(errorMsg);
            }
        );
    }

    async getWeatherByCity(city) {
        try {
            this.showLoading();
            
            // First get coordinates for the city
            const coords = await this.getCityCoordinates(city);
            if (!coords) {
                this.showError(`City "${city}" not found. Please check the spelling and try again.`);
                return;
            }
            
            await this.getWeatherByCoords(coords.lat, coords.lon, coords.name, coords.country);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError(`Failed to fetch weather data: ${error.message}`);
        }
    }

    async getCityCoordinates(city) {
        try {
            const url = `${this.geocodingURL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
            console.log('Fetching coordinates for:', city);
            console.log('API URL:', url);
            
            const response = await fetch(url);
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.length === 0) {
                console.log('No cities found for:', city);
                return null;
            }
            
            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].name,
                country: data[0].country
            };
        } catch (error) {
            console.error('Error getting city coordinates:', error);
            return null;
        }
    }

    async getWeatherByCoords(lat, lon, cityName = null, countryName = null) {
        try {
            const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            console.log('Fetching weather data from:', url);
            
            const response = await fetch(url);
            
            console.log('Weather API response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Weather API Error:', errorData);
                throw new Error(`Weather API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            
            const weatherData = await response.json();
            console.log('Weather data received:', weatherData);
            this.displayWeather(weatherData, cityName, countryName);
            
            // Also fetch 5-day forecast
            await this.getForecast(lat, lon);
            
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError(`Failed to fetch weather data: ${error.message}`);
        }
    }

    async getForecast(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            
            const forecastData = await response.json();
            this.displayForecast(forecastData);
            
        } catch (error) {
            console.error('Error fetching forecast:', error);
            // Don't show error for forecast, just hide the container
            this.forecastContainer.style.display = 'none';
        }
    }

    displayWeather(data, cityName = null, countryName = null) {
        // Update location info
        this.cityName.textContent = cityName || data.name;
        this.country.textContent = countryName || data.sys.country;
        this.date.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update weather icon
        const iconCode = data.weather[0].icon;
        this.weatherIcon.className = this.getWeatherIconClass(iconCode);

        // Update main weather info
        this.temperature.textContent = Math.round(data.main.temp);
        this.description.textContent = data.weather[0].description;

        // Update weather details
        this.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        this.humidity.textContent = `${data.main.humidity}%`;
        this.windSpeed.textContent = `${data.wind.speed} m/s`;
        this.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.pressure.textContent = `${data.main.pressure} hPa`;
        this.uvIndex.textContent = 'N/A'; // UV index requires separate API call

        this.showWeatherCard();
    }

    displayForecast(data) {
        // Group forecast by day and take the first entry for each day
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = item;
            }
        });

        // Convert to array and take first 5 days
        const forecastArray = Object.values(dailyForecasts).slice(0, 5);
        
        this.forecastList.innerHTML = '';
        
        forecastArray.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const iconClass = this.getWeatherIconClass(item.weather[0].icon);
            
            forecastItem.innerHTML = `
                <div class="forecast-date">${dayName}<br>${monthDay}</div>
                <div class="forecast-icon"><i class="${iconClass}"></i></div>
                <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
                <div class="forecast-desc">${item.weather[0].description}</div>
            `;
            
            this.forecastList.appendChild(forecastItem);
        });
        
        this.forecastContainer.style.display = 'block';
    }

    getWeatherIconClass(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',           // clear sky day
            '01n': 'fas fa-moon',          // clear sky night
            '02d': 'fas fa-cloud-sun',     // few clouds day
            '02n': 'fas fa-cloud-moon',    // few clouds night
            '03d': 'fas fa-cloud',         // scattered clouds
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',         // broken clouds
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',    // shower rain
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain', // rain day
            '10n': 'fas fa-cloud-moon-rain', // rain night
            '11d': 'fas fa-bolt',          // thunderstorm
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',     // snow
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',          // mist
            '50n': 'fas fa-smog'
        };
        
        return iconMap[iconCode] || 'fas fa-cloud';
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.weatherCard.style.display = 'none';
        this.errorMessage.style.display = 'none';
        this.forecastContainer.style.display = 'none';
    }

    showWeatherCard() {
        this.loading.style.display = 'none';
        this.weatherCard.style.display = 'block';
        this.errorMessage.style.display = 'none';
    }

    showError(message) {
        this.loading.style.display = 'none';
        this.weatherCard.style.display = 'none';
        this.errorMessage.style.display = 'block';
        this.forecastContainer.style.display = 'none';
        this.errorText.textContent = message;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
    
    // Add some helpful console messages
    console.log('🌤️ Weather App initialized!');
    console.log('🔍 Check the console for detailed API debugging information');
    console.log('🔗 If you have issues, verify your API key at: https://openweathermap.org/api');
});
