import "./App.css";
import Navbar from "../src/components/Navbar";
import { useEffect, useState } from "react";
import Mainweather from "../src/components/Mainweather";
import FiveDayForecast from "../src/components/fiveday";
import TodayHighlights from "../src/components/TodayHighlights";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Lucknow");
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);

  useEffect(() => {
    if (city) {
      fetchSkyScopeData(city);
    }
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = '77901c1472e8f64bc4c9fa82cd990259'; 
    axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then(response => {
        setAirQualityData(response.data.list[0]); 
      })
      .catch(error => {
        console.error('Error fetching the air quality data:', error);
        setAirQualityData(null); 
      });
  };

  const fetchSkyScopeData = (city) => {
    const API_KEY = "77901c1472e8f64bc4c9fa82cd990259";
    setWeatherData(null); 
    setAirQualityData(null);
    setFiveDayForecast(null);
    
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then(response => {
        setWeatherData(response.data);
        console.log(JSON.stringify(response.data)); 
        const { lat, lon } = response.data.coord;
        fetchAirQualityData(lat, lon); 
        
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
          .then(response => {
            setFiveDayForecast(response.data);
          })
          .catch(error => {
            console.error('Error fetching the 5-day forecast data:', error);
            setFiveDayForecast(null); 
          });
      })
      .catch(error => {
        console.error('Error fetching the weather data:', error);
        setWeatherData(null); 
      });
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      {weatherData && airQualityData &&  (
        <div style={{ display: "flex", padding: "30px", gap: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <Mainweather weatherData={weatherData} />
            <p style={{ fontWeight: "700", fontSize: "20px", marginTop: "20px" }}>5 Days Forecast</p>
            {fiveDayForecast && <FiveDayForecast forecastData={fiveDayForecast} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: "0.5", gap: "20px" }}>
            <TodayHighlights weatherData={weatherData} airQualityData={airQualityData}  />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
