const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const OptionSchema = new Schema({
    optionNo: {type: String},
    option: {type: String},
    isCorrect: {type: Boolean}
});

const ResponseSchema = new Schema({
    email: {type: String},
    marks: {type: String}
});


const ExamSchema = new Schema({
    examType: {type: String, default: 'objective'},
    examName: {type: String},
    duration: {type: Number, required: true},
    noOfQues: {type: Number, required: true},
    courseName: {type: String, required: true},
    courseId: {type: String},
    monitoring: {type: Boolean, default: false},
    date: {type: Date, required: true},
    negativeMarking: {type: Boolean, default: false},
    conductedBy: {type: ObjectId, required: true},
    questions: {type: [{quesNo: Number, ques: String, options: [OptionSchema]}]},
    responses: {type: [ResponseSchema]},
    examinees: {type: [String]}
});

const Exam = mongoose.model('Exam', ExamSchema);

module.exports = Exam;