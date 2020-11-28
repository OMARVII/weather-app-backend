const express = require('express');
const router = express.Router();
const { WeatherService } = require('./weather.service');
const Weather = require('./weather.model');

router.post('/', async (req, res) => {
    const city = req.body.city;
    const date = new Date();
    let result = null;
    const weatherForecast = await Weather.find({ city: city });

    if (weatherForecast.length) {
        result = weatherForecast[0].list.find(item => {
            return (item.time.getTime() > date.getTime());
        })
        res.status(200).send(result);
    } else {
        result = await getWeather(city, date);
        res.status(200).send(result);
    }
});

const getWeather = async (city, date) => {
    
    try {
        const forecast = await WeatherService.fetchForecast(city);

        const createdForecast = await Weather.create(forecast);

        const result = (forecast.list.find(item => {
            return (item.time.getTime() > date.getTime());
        }))

        return result;
    } catch (e) {
        throw e;
    }
}
module.exports = router;