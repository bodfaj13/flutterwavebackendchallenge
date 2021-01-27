var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet")

var indexRouter = require('./routes/index');

var app = express();

app.use(helmet())
app.use(bodyParser.json());
// validation for invalid json coming in in the request body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({
      message: 'Invalid JSON payload passed.',
      status: 'error',
      data: null
    })
  } else {
    next()
  }
})
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

module.exports = app;
