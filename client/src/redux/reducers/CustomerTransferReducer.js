import {
    CUSTOMER_TRANSFER_FAILURE,
    CUSTOMER_TRANSFER_SUCCESS,
    CUSTOMER_TRANSFER_REQUEST
} from '../consts/consts'

const initial = {
    loading: false,
    result: null,
    error: "",
}

const CustomerTransferReducer = (prevState = initial, action) => {
    switch(action.type){
        case CUSTOMER_TRANSFER_FAILURE:
            return {
                ...prevState,
                loading: false,
                error: action.payload
            }
        case CUSTOMER_TRANSFER_SUCCESS:
            return {
                ...prevState,
                loading: false,
                result: action.payload,
            }
            
        case CUSTOMER_TRANSFER_REQUEST:
            return {
                ...prevState,
                loading: true,
            }
            default: return prevState;
    }
}

export default CustomerTransferReducer;