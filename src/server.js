const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const connectDB = require('./db');
const route = require('./weather.controller');

const app = express();

connectDB();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use('/api', route);

const server = app.listen(
  config.PORT,
  console.log(
    `Server running on port ${config.PORT}`
  )
);
