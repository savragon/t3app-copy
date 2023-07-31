import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import axios from "axios";

export default function Home() {
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState<any | null>(null);
  const [performanceCriteria, setPerformanceCriteria] = useState<string>("");
  const [forecastData, setForecastData] = useState<any[]>([]);

  const handleCityNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(event.target.value);
  };

  const handleCityNameSubmit = () => {
    // Clear previous data before fetching new data
    setWeather(null);
    setPerformanceCriteria("");
    setForecastData([]);

    fetchData();
  };

  const calculatePoints = (weatherData: any): number => {
    let points = 0;

    // Check if it's Friday, Saturday, or Sunday
    const date = new Date();
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
      points += 2;
      console.log("Points from Weekend Bonus:", 2);
    }

    // Check weather conditions
    if (weatherData && weatherData.current) {
      const { is_day, condition, temp_c } = weatherData.current;

      if (condition.text.includes("Sunny")) {
        points += 3;
        console.log("Points from Sunny Weather:", 3);

        // Check if it's sunny the entire day
        if (is_day === 1) {
          points += 1;
          console.log("Additional Points from Full-day Sunshine:", 1);
        }
      } else if (
        condition.text.includes("Rain") ||
        condition.text.includes("Snow")
      ) {
        points -= 2;
        console.log("Points Deducted from Rain/Snow:", -2);
      } else if (condition.text.includes("Cloud")) {
        points += 2;
        console.log("Points from Partially Cloudy Weather:", 2);
      }

      // Check if it's very warm or hot
      if (temp_c >= 28) {
        points += 1;
        console.log("Points from Warm/Hot Temperature:", 1);
      }
    }

    return points;
  };

  const updatePerformanceCriteria = (points: number): string => {
    if (points >= 5) {
      return "Good";
    } else if (points >= 2) {
      return "Moderate";
    } else {
      return "Bad";
    }
  };

  const fetchData = async () => {
    if (cityName) {
      const apiKey = "3c0328747012edae286e57d70ce918c5";
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(currentWeatherUrl);
        if (response.ok) {
          const weatherData = await response.json();
          setWeather(weatherData);

          const points = calculatePoints(weatherData);
          console.log("Points Given:", points); // Log the points given
          const criteria = updatePerformanceCriteria(points);
          setPerformanceCriteria(criteria);
        } else {
          console.error(
            "Error fetching current weather data:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching current weather data:", error);
      }

      // Fetch 5-day weather forecast from OpenWeatherMap API
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
          const forecastData = await response.json();
          const forecastDays = forecastData.list
            .slice(0, 5)
            .map((dayData: any) => ({
              date: dayData.dt_txt,
              day: {
                condition: { text: dayData.weather[0].description },
                temp_c: dayData.main.temp,
              },
            }));
          setForecastData(forecastDays);
        } else {
          console.error(
            "Error fetching 5-day weather forecast data:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching 5-day weather forecast data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [cityName]);

  return (
    <div className="bg-custom h-screen w-full bg-cover bg-center bg-no-repeat font-medium">
      <FaBars className="fixed left-5 top-5 text-3xl text-white" />
      <div className="items-center justify-center bg-emerald-500 p-5 text-white">
        <h1 className="text-center text-3xl">CarSpot</h1>
      </div>
      <div>
        <div className="flex items-center justify-center p-5 font-medium text-black">
          <div className="relative w-full lg:max-w-sm">
            <div className="flex">
              <input
                type="text"
                className="w-full appearance-none rounded-md border bg-white p-2.5 text-gray-500 shadow-sm outline-none focus:border-indigo-600"
                placeholder="Enter Your City Name"
                value={cityName}
                onChange={handleCityNameChange}
              />
              <button
                className="ml-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                onClick={handleCityNameSubmit}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="mx-10 rounded-md bg-white p-5 shadow-2xl">
          <h1 className="mb-10 flex items-center justify-center text-2xl font-semibold">
            CarCast For Today
          </h1>
          {/* Display the performance criteria for the current day */}
          {performanceCriteria === "Good" && (
            <img src="/GOOD.png" alt="Good" className="mx-auto w-72" />
          )}
          {performanceCriteria === "Moderate" && (
            <img src="/FINE.png" alt="Moderate" className="mx-auto w-72" />
          )}
          {performanceCriteria === "Bad" && (
            <img src="/POOR.png" alt="Bad" className="mx-auto w-72" />
          )}
        </div>
        <div className="mx-10 flex flex-col items-center rounded-md bg-white p-5 shadow-2xl">
          <h1 className="mb-10 text-2xl font-semibold">
            CarCast for the Next 5 Days
          </h1>
          <div className="flex justify-center">
            {/* Display the performance criteria for the next 5 days in a row */}
            {forecastData.map((dayData) => {
              const date = new Date(dayData.date);
              const points = calculatePoints(dayData.day);
              const criteria = updatePerformanceCriteria(points);

              // Determine the image source based on the criteria
              let imageSrc;
              if (criteria === "Good") {
                imageSrc = "/GOOD.png";
              } else if (criteria === "Moderate") {
                imageSrc = "/FINE.png";
              } else {
                imageSrc = "/POOR.png";
              }

              return (
                <div key={dayData.date} className="w-1/5">
                  {/* Display the performance criteria image */}
                  <img src={imageSrc} alt={criteria} className="mx-auto w-72" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
