const express = require('express');
//const path = require('path');
const app = express();
const connectDB = require('./config/connectDB')
const catRoutes = require('./routes/catRoutes');
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/userModel')
const PORT = process.env.PORT || 3000


//Use .env file in config folder
require("dotenv").config();

//Connect To Database
connectDB()

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
//app.use(express.static(path.join(__dirname, 'public')));

//Static Folder
app.use(express.static('public'));

//Using EJS for views
app.set('view engine', 'ejs');

//Setup Sessions - stored in MongoDB
app.use(session({
  secret: 'this is catbook', 
  resave: false,
  saveUninitialized: false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//this is passing the current user info to all routes
app.use((req,res,next) => {
  res.locals.currentUser = req.user
  next()
})

//Setup Routes For Which The Server Is Listening
app.use('/', catRoutes);
app.use('/', userRoutes)

//Server Running
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})