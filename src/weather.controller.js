const express = require('express');
const router = express.Router();
const { WeatherService } = require('./weather.service');
const Weather = require('./weather.model');
const { response } = require('express');

router.get('/weather', async (req, res) => {
    const { lat, long } = req.query;
    let result = null;

    if (lat && long) {
        result = await getWeather('', lat, long);
        res.status(200).send(result);
    }

    let city = (req.query.city.toLowerCase());
    city = city.charAt(0).toUpperCase() + city.slice(1);

    const weatherForecast = await Weather.find({ city: city });

    if (weatherForecast.length) {
        result = weatherForecast[0].list.find(item => {
            return (item.time.getTime() > new Date().getTime());
        })
        result['city'] = weatherForecast[0].city;
        result['country'] = weatherForecast[0].country;
        result = { time: result.time, temperature: result.temperature, conditionsGroup: result.conditionsGroup, city: weatherForecast[0].city, country: weatherForecast[0].country }
        res.status(200).send(result);
    } else {
        result = await getWeather(city);
        if (result.cod == '404') {
            res.status(404).send(result);
        }
        res.status(200).send(result);
    }
});

const getWeather = async (city = '', lat = '', long = '') => {

    try {
        const forecast = await WeatherService.fetchForecast(city, lat, long);
        if (forecast.cod == '404') {
            return forecast;
        }

        await Weather.create(forecast);
        const result = (forecast.list.find(item => {
            return (item.time.getTime() > new Date().getTime());
        }))

        result['city'] = forecast.city;
        result['country'] = forecast.country;
        return result;
    } catch (e) {
        throw e;
    }
}
module.exports = router;