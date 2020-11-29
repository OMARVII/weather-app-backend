const fetch = require('node-fetch');
const config = require('./config');

const fetchForecast = async (city, lat, long) => {
    let api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${config.OPEN_WEATHER}`;
    if (lat && long) {
        api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${config.OPEN_WEATHER}`
    }
    console.log(api)
    try {
        const weather = await fetch(
            api
        );
        const response = await weather.json();
        if (response.cod == '404') {
            return response;
        }
        let city = (response.city.name.toLowerCase());
        city = city.charAt(0).toUpperCase() + city.slice(1);
        const data = {
            'city': city,
            'country': response.city.country,
            'list': response.list.map(item => ({
                'time': new Date(item.dt * 1000),
                'temperature': Math.round(item.main.temp),
                'conditionsGroup': item.weather[0].main,
                'conditions': item.weather[0].description
            })
            )
        };
        return data;
    } catch (e) {
        throw new Error('OPM API Error');
    }
}

module.exports = {
    WeatherService: {
        fetchForecast,
    }
}
