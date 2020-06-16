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
        date: exam.date,
        });
    }
    res.json({exams: exams});
});

router.get('/examsAttended', function(req, res){
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
            date: exam.date,
            marks: marks
        });
    }
    res.json({exams: exams});
});

module.exports = router;