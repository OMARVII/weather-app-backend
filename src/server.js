const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const connectDB = require('./db');

const app = express();

connectDB();

app.use(express.json());

app.use(cors());

app.use(helmet());

const server = app.listen(
  config.PORT,
  console.log(
    `Server running on port ${config.PORT}`
  )
);
