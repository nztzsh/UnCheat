const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
require('./passport-setup');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth-routes');
const passport = require('passport');
const examRoutes = require('./routes/exam-routes');
const bodyParser = require('body-parser');
const Exam = require('./models/Exam');



const app = express();

//Set View engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 300 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

// parse application/json
app.use(bodyParser.json());

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
app.use('/exam', examRoutes);

app.get('/test/:examId',async function(req, res){
    try{
      if(req.user){
        let examId = mongoose.Types.ObjectId(req.params.examId);
        let exam = await Exam.findById(examId);
        //if exam is created by user
        if(exam.conductedBy.equals(req.user._id)){
  
        }else{
          //if user is not allowed to give exam
          if(!(exam.examinees.some(att => att === req.user.email))){
            res.send('You are not allowed to give this exam');
          }
          //if exam has not started yet
          //else if(new Date().getTime() < exam.date.getTime()){
            //res.send('Exam has not started yet');
          //}
          else{
            res.render('WriteExam', {exam: exam, questions: exam.questions});
          }
        }
        
      }
      else{
        res.redirect('/');
      }
    }
    catch(e){
      console.log(e);
    }
});

function checkUser(req, res, next){
    if(req.user){
      req.url = `/app/${req.url}`;
    }
    next()
}

app.use(checkUser);
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));


app.listen(process.env.PORT, function(){
    console.log('Listening to port ' + process.env.port);
});