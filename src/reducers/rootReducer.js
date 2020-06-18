const initState = {
    examsCreated: [],
    examsAttended: []
}

const rootReducer = (state = initState, action) => {

    if(action.type === 'GET_TESTS'){
        return {
            ...state,
            examsCreated: action.examsCreated,
            examsAttended: action.examsAttended
        }
    }
    if(action.type === 'CREATE_TEST'){
        return {
            ...state,
            examsCreated: [...state.examsCreated, action.newExam]
        }
    }

    return state;
}

export default rootReducer;