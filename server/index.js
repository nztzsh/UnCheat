const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
require('./passport-setup');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth-routes');
const passport = require('passport');


const app = express();

// set up session cookies
app.use(cookieSession({
    maxAge: 300 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose.connect(process.env.DB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Connection established");
    }
  });

// set up routes
app.use('/auth', authRoutes);

function checkUser(req, res, next){
    if(req.user){
        req.url = `/app/${req.url}`;
    }
    next()
}

app.use(checkUser);
app.use('/app', express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));


app.listen(process.env.PORT, function(){
    console.log('Listening to port ' + process.env.port);
});