const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const log4js = require('log4js');
const cors = require("cors");
const flash = require('req-flash');
const PORT = process.env.PORT || '3000';
const passport = require('passport');

require('./init');

const app = express();
const corsOption = {
  origin: "http://localhost:3001"
}
app.use(cors())

app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: "123", resave: true, saveUninitialized: true }));
app.use(flash());
app.use(helmet());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser());
app.use('/', require('./routes'));
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

module.exports = app;
