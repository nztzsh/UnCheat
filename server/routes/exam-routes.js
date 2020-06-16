const router = require('express').Router();
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
        if(exam.examinees.length > 0){
            for(i=0; i<exam.examinees.length; i++){
                let examinee = await User.findOne({email: exam.examinees[i]});
                if(examinee){
                    examinee.examsAttended.push(exam._id);
                    await examinee.save();
                }
            }
        }
        return res.json({exam: exam});
    }
    catch(e){
        console.log(e);
        return res.status(500).send({message: 'Server Error'});
    }
});

router.get('/examsCreated', function(req, res){
    res.json({exams: req.user.examsCreated});
});

router.get('/examsAttended', function(req, res){
    res.json({exams: req.user.examsAttended});
});

module.exports = router;