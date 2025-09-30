# 🌤️ Weather Forecast App

A modern, responsive weather application built with HTML, CSS, and JavaScript that uses the OpenWeather API to provide real-time weather information and 5-day forecasts.

## ✨ Features

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **5-Day Forecast**: View detailed weather forecasts for the next 5 days
- **Geolocation Support**: Automatically detect and show weather for your current location
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Interactive Search**: Search for weather by city name with autocomplete
- **Detailed Information**: View temperature, humidity, wind speed, pressure, visibility, and more
- **Weather Icons**: Dynamic weather icons that change based on current conditions
- **Error Handling**: Graceful error handling with user-friendly messages

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OpenWeather API key (free to obtain)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Weather_Forecast
   ```

2. **Get your OpenWeather API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to the API section and copy your API key

3. **Configure the API Key**
   - Open `script.js` in your code editor
   - Find line 4: `this.apiKey = 'YOUR_API_KEY_HERE';`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   this.apiKey = 'your_actual_api_key_here';
   ```

4. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or use a local server for better development experience:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node.js (if installed)
   npx serve .
   
   # Using PHP (if installed)
   php -S localhost:8000
   ```

## 🎯 How to Use

1. **Search by City**: Enter a city name in the search box and click the search button or press Enter
2. **Use Current Location**: Click the location button to automatically get weather for your current position
3. **View Details**: The app displays comprehensive weather information including:
   - Current temperature and weather conditions
   - Feels-like temperature
   - Humidity percentage
   - Wind speed
   - Atmospheric pressure
   - Visibility
   - 5-day weather forecast

## 🛠️ API Endpoints Used

The app uses the following OpenWeather API endpoints:

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- **Geocoding**: `https://api.openweathermap.org/geo/1.0/direct`

## 📱 Responsive Design

The app is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 Customization

### Changing the Color Scheme
Edit the CSS variables in `styles.css` to customize the appearance:
```css
/* Main gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Primary color */
color: #667eea;
```

### Adding New Weather Details
To add more weather information, modify the `displayWeather()` method in `script.js` and add corresponding HTML elements in `index.html`.

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to fetch weather data" Error**
   - Check if your API key is correctly set in `script.js`
   - Verify your internet connection
   - Ensure you haven't exceeded the API rate limit

2. **Location Access Denied**
   - Make sure you've granted location permissions in your browser
   - Try refreshing the page and allowing location access when prompted

3. **City Not Found**
   - Check the spelling of the city name
   - Try using the full city name (e.g., "New York" instead of "NYC")
   - Some cities might need country specification (e.g., "London, UK")

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Internet Explorer**: Not supported (uses modern JavaScript features)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure your API key is valid and active
4. Verify your internet connection

## 🌟 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Font Awesome](https://fontawesome.com/) for the weather icons
- [Google Fonts](https://fonts.google.com/) for the Inter font family

---

**Enjoy checking the weather! 🌤️**
