'use strict';

const morgan = require('morgan');
const { ENVIRONMENT } = require('../config');

morgan.format('development', morgan.dev);
morgan.format('production', morgan.common);
morgan.format('test', () => { });

module.exports = morgan(ENVIRONMENT);
