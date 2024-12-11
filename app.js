require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
require('./routes.js')(app);

module.exports = app;