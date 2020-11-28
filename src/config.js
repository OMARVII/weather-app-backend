const dotenv = require('dotenv')

dotenv.config({ path: '../config.env' });

module.exports = {
    PORT: process.env.PORT || 5000,
    OPEN_WEATHER: process.env.OPEN_WEATHER
}