import transport from '../config/transport';

const getTests = () => {
    return async (dispatch) => {
        try{
            let res1 = await transport.get('/exam/examsCreated');
            let res2 = await transport.get('/exam/examsAttended');
            dispatch({type: 'GET_TESTS', examsCreated: res1.data.exams, examsAttended: res2.data.exams});
        }catch(e){
            console.log(e);
        }
    }
}

export default getTests;