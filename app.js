if(process.env.NODE_ENV !== 'production'){
  require("dotenv").config();
}
// console.log(process.env.Cloudname)
const express = require('express');
const app = express(); 
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const Errorhandle = require('./utils/errorhandle');
const userroute = require('./routes/user_routes');
const camproute = require('./routes/campground_routes');
const revroute = require('./routes/rev_routes');
const mongoSanitize = require('express-mongo-sanitize');

const multer  = require('multer');
const { default: helmet } = require("helmet");
// const { url } = require("inspector");
const db_url=process.env.DB_URL
// console.log(process.env.DB_URL)
// 
mongoose.connect(db_url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected');
});

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.tiles.mapbox.com/",
  // "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.mapbox.com/",
  // "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
  "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dx7nxtuxx/",
              "https://images.unsplash.com/",
              "https://api.maptiler.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static('public'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


const sessionconfig = {
  store: MongoStore.create({
    mongoUrl: db_url,
    ttl: 14 * 24 * 60 * 60 
  }),
  secret:'thisisasecret',
  resave: false,
  saveUninitialized: true,
  // secure:true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionconfig));


app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(mongoSanitize());
app.use((req, res, next) => {
  if(!['/login', '/'].includes(req.originalUrl)){
      req.session.returnTo= req.originalUrl;
  }
  res.locals.currentuser=req.user
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userroute);
app.use('/campgrounds', camproute);
app.use('/campgrounds/:id/review', revroute);


app.get('/', (req, res) => {
  const currentUser = req.user
  res.render('home', {currentUser});
});


app.all('*', (req, res, next) => {
  next(new Errorhandle('Invalid request', 404));
});

app.use((err, req, res, next) => {
  const { message = 'Something went wrong', statuscode = 500 } = err;
  res.status(statuscode).render('campgrounds/error_alert', { err });
});


app.listen(3000, () => {
  console.log('Server started');
});
