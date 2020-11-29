const express = require('express');
const router = express.Router();
const { WeatherService } = require('./weather.service');
const Weather = require('./weather.model');
const { response } = require('express');

router.get('/:city', async (req, res) => {
    let city = (req.params.city.toLowerCase());
    city = city.charAt(0).toUpperCase() + city.slice(1);
    console.log(city)
    const date = new Date();
    let result = null;
    const weatherForecast = await Weather.find({ city: city });

    if (weatherForecast.length) {
        result = weatherForecast[0].list.find(item => {
            return (item.time.getTime() > date.getTime());
        })
        result['city'] = weatherForecast[0].city;
        result['country'] = weatherForecast[0].country;
        result = { time: result.time, temperature: result.temperature, conditionsGroup: result.conditionsGroup, city: weatherForecast[0].city, country: weatherForecast[0].country }
        res.status(200).send(result);
    } else {
        result = await getWeather(city, date);
        if (result.cod == '404') {
            res.status(404).send(result);
        }
        res.status(200).send(result);
    }
});

const getWeather = async (city, date) => {

    try {
        const forecast = await WeatherService.fetchForecast(city);
        if (forecast.cod == '404') {
            return forecast;
        }
        const createdForecast = await Weather.create(forecast);
        const result = (forecast.list.find(item => {
            return (item.time.getTime() > date.getTime());
        }))
        result['city'] = forecast.city;
        result['country'] = forecast.country;
        return result;
    } catch (e) {
        throw e;
    }
}
module.exports = router;