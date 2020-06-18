import transport from '../config/transport';

const createTest = (examType, examName, duration, noOfQues, courseName, courseId, monitoring, date, negativeMarking, questions, examinees) => {
    return async (dispatch) => {
        try{
            let res = await transport.post('/exam/schedule', {
                examType,
                examName,
                duration,
                noOfQues,
                courseName,
                courseId,
                monitoring,
                date,
                negativeMarking,
                questions,
                examinees
            });
            dispatch({type: 'CREATE_TEST', newExam: res.data.newExam});

        }catch(e){
            console.log(e);
        }
    }
}

export default createTest;