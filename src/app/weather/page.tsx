"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "./weather.module.css";

interface WeatherEntry {
  dt_txt: string;
  main: { temp: number; humidity: number };
  weather: { description: string }[];
  wind: { speed: number };
}

interface ForecastData {
  list: WeatherEntry[];
  city: { name: string };
}

export default function WeatherPage() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [inputCity, setInputCity] = useState("");

  const fetchForecast = async (cityName: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      if (!res.ok) throw new Error("Failed to fetch forecast");
      const data = await res.json();
      setForecast(data);
      setCity(data.city.name);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      fetchForecast(inputCity.trim());
      setInputCity("");
    }
  };

  const dailyForecast = forecast
    ? forecast.list.filter((entry) => entry.dt_txt.includes("12:00:00"))
    : [];

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Current Weather & 5-Day Forecast</h2>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city name"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>

        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {forecast && forecast.list.length > 0 && (
          <>
            <div className={styles.current}>
              <h3 className={styles.currentTitle}>Current Weather - {city}</h3>
              <p><strong>Temperature:</strong> {forecast.list[0].main.temp.toFixed(1)}°C</p>
              <p><strong>Humidity:</strong> {forecast.list[0].main.humidity}%</p>
              <p><strong>Condition:</strong> {forecast.list[0].weather[0].description}</p>
            </div>

            <div className={styles.daily}>
              <h3 className={styles.dailyTitle}>Next 5 Days Forecast</h3>
              <div className={styles.cards}>
                {dailyForecast.map((entry) => (
                  <div key={entry.dt_txt} className={styles.weatherCard}>
                    <div className={styles.weatherCardDay}>
                      {getDayName(entry.dt_txt)}
                    </div>
                    <p><strong>Date:</strong> {entry.dt_txt.split(" ")[0]}</p>
                    <p><strong>Temp:</strong> {entry.main.temp.toFixed(1)}°C</p>
                    <p><strong>Humidity:</strong> {entry.main.humidity}%</p>
                    <p><strong>Condition:</strong> {entry.weather[0].description}</p>
                    <p><strong>Wind:</strong> {entry.wind.speed} m/s</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
