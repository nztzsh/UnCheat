const router = require('express').Router();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const User = require('../models/User');

router.post('/schedule', async function(req, res){
    let examType = req.body.examType;
    let examName = req.body.examName;
    let duration = req.body.duration;
    let noOfQues = req.body.noOfQues;
    let courseName = req.body.courseName;
    let courseId = req.body.courseId;
    let monitoring = req.body.monitoring;
    let date = req.body.date;
    let negativeMarking = req.body.negativeMarking;
    let conductedBy = req.user._id;
    let questions = req.body.questions;
    let examinees = req.body.examinees;

    let exam = new Exam({
        examType,
        examName,
        duration,
        noOfQues,
        courseName,
        courseId,
        monitoring,
        date,
        negativeMarking,
        conductedBy,
        questions,
        examinees
    });

    try{
        await exam.save();
        let user = await User.findById(req.user._id);
        await user.examsCreated.push(exam._id);
        await user.save();
        if(exam.examinees.length > 0){
            for(i=0; i<exam.examinees.length; i++){
                let examinee = await User.findOne({email: exam.examinees[i]});
                if(examinee){
                    examinee.examsAttended.push(exam._id);
                    await examinee.save();
                }
            }
        }
        return res.json({newExam: 
            {examName: exam.examName, 
            examId: exam._id,
            duration: exam.duration,
            courseName: exam.courseName,
            courseId: exam.courseId,
            date: exam.date.getDate() + '-' + exam.date.getMonth() + '-' + exam.date.getFullYear(),
            time: exam.date.getHours() + ':' + exam.date.getMinutes()}});
    }
    catch(e){
        console.log(e);
        return res.status(500).send({message: 'Server Error'});
    }
});

router.get('/examsCreated', async function(req, res){
    let exams = [];
    for(i=0; i<req.user.examsCreated.length; i++){
        let exam = await Exam.findById(req.user.examsCreated[i]);
        exams.push({
        examName: exam.examName, 
        examId: exam._id,
        duration: exam.duration,
        courseName: exam.courseName,
        courseId: exam.courseId,
        date: exam.date.getDate() + '-' + exam.date.getMonth() + '-' + exam.date.getFullYear(),
        time: exam.date.getHours() + ':' + exam.date.getMinutes()
        });
    }
    res.json({exams: exams});
});

router.get('/examsAttended', async function(req, res){
    let exams = []
    for(i=0; i<req.user.examsAttended.length; i++){
        let exam = await Exam.findById(req.user.examsAttended[i]);
        let marks = 'NA';
        for(j=0; j<exam.responses.length; j++){
            if(exam.responses[j].email === req.user.email){
                marks = exam.responses[j].marks;
                break;
            }
        }
        exams.push({
            examName: exam.examName,
            examId: exam._id,
            duration: exam.duration,
            courseName: exam.courseName,
            courseId: exam.courseId,
            date: exam.date.getDate() + '-' + exam.date.getMonth() + '-' + exam.date.getFullYear(),
            time: exam.date.getHours() + ':' + exam.date.getMinutes(),
            marks: marks
        });
    }
    res.json({exams: exams});
});

router.get('/writeExam', async function(req, res){
    try{
        let examId = mongoose.Types.ObjectId(req.query.examId);
        let exam = await Exam.findById(examId);

        //if exam is conducted by user
        if(exam.conductedBy.equals(req.user._id)){
            res.json({
                message: 'details',
                examName: exam.examName,
                examType: exam.examType,
                duration: exam.duration,
                noOfQues: exam.noOfQues,
                courseName: exam.courseName,
                courseId: exam.courseId,
                monitoring: exam.monitoring,
                date: exam.date.getDate() + '-' + exam.date.getMonth() + '-' + exam.date.getFullYear() + ' ' + exam.date.getHours() + ':' + exam.date.getMinutes(),
                examinees: exam.examinees,
                responses: exam.responses   
        });
        }
        //else
        else{
            res.json({
                message: 'write',
                duration: exam.duration,
                date: exam.date,
                noOfQues: exam.noOfQues,
                monitoring: exam.monitoring,
                questions: exam.questions,
                examinees: exam.examinees
            });
        }
    }
    catch(e){
        console.log(e);
    }
});

router.post('/submit', async function(req,res){
    let myoptions = req.body.options;
    let exam = await Exam.findById(mongoose.Types.ObjectId(req.body.examId));
    let marks = 0;
    for(i=0; i<myoptions.length; i++){
        if(exam.questions[i].options.find(option => option.optionNo === myoptions[i]).isCorrect){
            marks = marks + 1;
        }
    }
    let response = {email: req.user.email, marks: marks};
    exam.responses.push(response);
    await exam.save();
    if(!req.user.examsAttended.some(examId => examId.equals(exam._id))){
        req.user.examsAttended.push(examId);
        await req.user.save();
    }
    res.redirect('/');
});

module.exports = router;