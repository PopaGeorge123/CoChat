const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();


const path = require('path');

const app = express();

app.use(cors());


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/', express.static(path.join(__dirname, 'images')));

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = process.env.MONGOURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));

app.get('/test',async (req, res)=>{
  res.render('test')
})
app.use('/users', require('./routes/users.js'));

app.use('/data',require('./routes/data.js'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  http://localhost:${PORT}`));

module.exports = mongoose;