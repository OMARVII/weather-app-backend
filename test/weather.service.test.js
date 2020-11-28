jest.mock('node-fetch');
console.log('')
const fetch = require('node-fetch');

const config = require('../src/config');
const apiSample = require('./samples/api-response');
const { WeatherService } = require('../src/weather.service');

describe.only('weather.service', () => {
    beforeEach(() => {
        fetch.mockReturnValue({
            json: () => apiSample,
        });
    });

    it('should send a request with city and api key', async () => {
        const expected = `https://api.openweathermap.org/data/2.5/forecast?q=Cairo&units=metric&appid=${config.OPEN_WEATHER}`;

        await WeatherService.fetchForecast('Cairo');

        expect(fetch).toBeCalledWith(expected);
    });

    it('should map the api return value correclty', async () => {
        const result = await WeatherService.fetchForecast('Cairo');

        expect(result.city).toBe('Cairo');
        expect(result.country).toBe('EG');
        result.list.forEach(item => {
            expect(item).toMatchSnapshot({
                'time': expect.any(Date),
                'temperature': expect.any(Number),
                'conditionsGroup': expect.any(String),
                'conditions': expect.any(String)
            });
        });
    });

    it('should throw custom error on api call fail', async () => {
        fetch.mockReturnValue(undefined);

        await expect(WeatherService.fetchForecast('Cairo'))
            .rejects.toThrowError('OPM API Error');
    });
});