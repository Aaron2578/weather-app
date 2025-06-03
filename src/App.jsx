import { useEffect, useState } from "react";
import "./App.css"
import weatherLogo from './assets/weather-logo.svg';
import reactlogo from './assets/react.svg';
function App() {
  const [search, setSearch] = useState("")
  const [weather, setWeather] = useState([])
  const [loader, setLoader] = useState(false)
  const KEY = 'd0c4296633ff5772cc22cdf76741465a'
  useEffect(function () {
    const controller = new AbortController();
    setLoader(true)
    async function weatherapi() {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${KEY}`, { signal: controller.signal });
        if (!res) throw new Error("Weather not fetched");
        const data = await res.json();
        setWeather(data)
        setLoader(false)
      }
      catch (err) {
        if (err.name !== "AbortError")
          console.error("Fetch Error", err)
      }
    }
    weatherapi()
    return () => {
      controller.abort();
    }

  }, [search])

  useEffect(function () {
    if (!search) return;
    document.title = `${search}`

    return () => {
      document.title = "Weather"
      console.log('search')
    }
  }, [search])

  const kelvinToC = k => (k - 273.15).toFixed(1);
  const temperature = kelvinToC(weather?.main?.temp);
  const speed = 0.74 * 3.6;
  const date = new Date().toDateString();

  return (
    <div>
      <div className="container mx-auto flex justify-between items-center mt-3">
        <span className="container mx-auto flex items-center gap-2 font-bold text-2xl text-black">
          <img src={weatherLogo} alt="logo" width={50} />Weather</span>
        <span>{date}</span>
      </div>
      <form className="container mx-auto my-5 text-1xl font-medium flex justify-center gap-3 rounded focus:outline-none
 ">
        <input type="text" className="border rounded-full px-5 py-2 mt-6 text-black" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Enter the City Name" />
      </form>
      <div className="flex justify-center items-center mt-5">
        {search === "" ? (
          <p className="text-gray-600 font-medium">Enter a city to search</p>
        ) : loader ? (
          <p className="text-blue-600 font-semibold animate-pulse">Data is fetching...</p>
        ) : weather?.coord ? (
          <div className="bg-blue-600 text-white container mx-auto rounded-2xl p-6 w-80 sm:w-150">
            <div className="flex justify-between items-start p-0 m-0">
              <div className="items-start">
                <p className="text-4xl">{weather.name}</p>
                <p className="text-xl">{weather.sys.country}</p>
                <p className="text-xl pt-3">Lat: {weather.coord.lat}, Lon: {weather.coord.lon}</p>
                <p className="xl:text-xl">{weather.weather[0].main}</p>
                <p>{weather.weather[0].description}</p>
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <p className="text-xl">Temp : {temperature} &deg;C </p>
              <p className="text-xl">Wind Speed : ~{speed.toFixed(2)}km/h</p>
            </div>
          </div>
        ) : (
          <p className="text-red-600 font-medium">No data found</p>
        )}
      </div>
      <div className="flex justify-center mt-20">
        <h2 className="text-center flex items-center gap-2">Created using <span className="bg-black p-1 rounded-full"><img src={reactlogo} alt="react logo" width={19} /></span>React</h2>
      </div>
    </div >
  )
}
export default App;
