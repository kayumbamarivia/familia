const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const session = require('express-session');
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Call config
require("dotenv").config();

// Require necessary modules
const loginRoute = require("./src/routes/open/login");
const registerRoute = require("./src/routes/open/signup");
const usersRoute = require("./src/routes/protected/users");

// DB connectivity
const connect = require("./src/models/DB");

// Initialize Express app
const app = express();

// Connect to the database
connect();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Create home Interface
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get("/protected", (req, res) => {
  res.status(200).render("welcome");
});

app.get("/failed", (req, res) => {
  res.status(500).render("failure");
});

// Set view engine
app.set("view engine", "ejs");
app.use("/api/v1/login", loginRoute);
app.use("/api/v1/register", registerRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/swagger", swaggerUI.serve, swaggerUI.setup(require("./swagger")));

// Configure the Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:1001/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes for authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/google/callback',
  passport.authenticate('google', { successRedirect: '/protected', failureRedirect: '/failed' })
);

app.listen(process.env.PORT, () =>
  console.log(`server is running on http://localhost:${process.env.PORT}`)
);
