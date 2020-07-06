import {
    CUSTOMER_TRANSFER_FAILURE,
    CUSTOMER_TRANSFER_SUCCESS,
    CUSTOMER_TRANSFER_REQUEST,
    SAVE_RECEIVER_FAILURE,
    SAVE_RECEIVER_REQUEST,
    SAVE_RECEIVER_SUCCESS,

} from '../consts/consts'

const initial = {
    loading: false,
    result: null,
    error: "",
    save: null,
}

const CustomerTransferReducer = (prevState = initial, action) => {
    switch(action.type){
        case CUSTOMER_TRANSFER_FAILURE :
            return {
                ...prevState,
                loading: false,
                error: action.payload,
                result: false,
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
                result: null, 
                error: "",        
            }

            case SAVE_RECEIVER_FAILURE:
                return {
                    ...prevState,
                    loading: false,
                    error: action.payload,
                    save: false,
                }
            case SAVE_RECEIVER_SUCCESS:
                return {
                    ...prevState,
                    loading: false,
                    save: action.payload,
                }
                
            case SAVE_RECEIVER_REQUEST:
                return {
                    ...prevState,
                    loading: true,
                    save: null,
                }
            default: return prevState;
    }
}

export default CustomerTransferReducer;