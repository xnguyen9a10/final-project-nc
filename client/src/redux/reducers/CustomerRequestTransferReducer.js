import {
    CUSTOMER_REQUEST_TRANSFER,
    CUSTOMER_REQUEST_TRANSFER_SUCCESS,
    CUSTOMER_REQUEST_TRANSFER_FAILURE
} from '../consts/consts'

const initial = {
    loading: false,
    result: null,
    data: null,
    error: "",
}

const CustomerTransferReducer = (prevState = initial, action) => {
    switch(action.type){
        case CUSTOMER_REQUEST_TRANSFER_FAILURE:
            return {
                ...prevState,
                loading: false,
                result: false,
                error: action.payload
            }
        case CUSTOMER_REQUEST_TRANSFER_SUCCESS:
            return {
                ...prevState,
                loading: false,
                result: true,
            }
            
        case CUSTOMER_REQUEST_TRANSFER:
            return {
                ...prevState,
                loading: true,
                data: action.payload,
                result: null,
            }
            default: return prevState;
    }
}

export default CustomerTransferReducer;