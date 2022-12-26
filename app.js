
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride =require('method-override');
const session = require('express-session');
const flash =require('connect-flash');
const passport = require('passport');
const LocalStrategy= require('passport-local');
const User  =require('./models/User')
const MongoStore = require('connect-mongo');





//Routes
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes');



const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Shopping-App'

// Connect MongoDB at default port 27017.
mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB Connection Succeeded."))
  .catch((err) => console.log("Error in DB connection: " + err));



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'))

//store for session on mongoDB
const store = MongoStore.create({
  mongoUrl:dbUrl,
  touchAfter : 1*24*60*60
})


const secret = process.env.SECRET || 'weneedabettersecret'

const sessionConfig = {
  store:store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    expires: Date.now() + 1000*60*60*24*7*1
  }
}



//set up the session on the server side
app.use(session(sessionConfig));
app.use(passport.authenticate('session'));
app.use(flash());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//setting up locals 
app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next(); 
})


app.use(express.urlencoded({extended:true}));

//Routes
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes)
app.use(cartRoutes)









app.get("/", (req, res) => {
  res.render('home');
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

//Run app, then load http://localhost:3000 in a browser to see the output.
