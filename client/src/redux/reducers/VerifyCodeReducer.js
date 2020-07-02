import {
    VERIFY_CODE_REQUEST,
    VERIFY_CODE_SUCCESS,
    VERIFY_CODE_FAILURE,
} from '../consts/consts';

const initial = {
    loading: false,
    result: false,
    error: null,
}

const VerifyCodeReducer = (prevState = initial, action) => {
    switch(action.type){
        case VERIFY_CODE_FAILURE:
            return {
                ...prevState,
                loading: false,
                result: false,
                error: action.payload
            }
        case VERIFY_CODE_SUCCESS:
            return {
                ...prevState,
                loading: false,
                result: true
            }
            
        case VERIFY_CODE_REQUEST:
            return {
                ...prevState,
                loading: true,
            
            }
            default: return prevState;
    }
}

export default VerifyCodeReducer;