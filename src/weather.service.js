const fetch = require('node-fetch');
const config = require('./config');

const fetchForecast = async (city) => {
    try {
        const weather = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${config.OPEN_WEATHER}`
        );
        const response = await weather.json();
        if (response.cod == '404') {
            return response;
        }
        const data = {
            'city': response.city.name,
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
