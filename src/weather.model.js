const mongoose = require('mongoose');

const baseOptions = {
    timestamps: true,
};

const weatherItemSchema = new mongoose.Schema(
    {
        time: {
            type: Date
        },
        temperature: {
            type: Number
        },
        conditionsGroup: {
            type: String
        }, 
        conditions: {
            type: String
        },
    }
);

const weatherSchema = new mongoose.Schema(
    {
        city: {
            type: String
        },
        country: {
            type: String
        },
        list: [
            weatherItemSchema
        ]

    },
    baseOptions
);

module.exports = mongoose.model('Weather', weatherSchema);