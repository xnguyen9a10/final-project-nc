import {
    FETCH_CUSTOMER_ACCOUNT_FAILURE,
    FETCH_CUSTOMER_ACCOUNT_SUCCESS,
    FETCH_CUSTOMER_ACCOUNT_REQUEST
} from '../consts/consts'

const initial = {
    loading: false,
    customer: null,
    accounts: [],
    error: "",
}


const CustomerAccountReducer = (prevState = initial, action) => {
    switch(action.type){
        case FETCH_CUSTOMER_ACCOUNT_FAILURE:
            return {
                ...prevState,
                loading: false,
                error: action.payload
            }
        case FETCH_CUSTOMER_ACCOUNT_SUCCESS:
            return {
                ...prevState,
                loading: false,
                customer: action.payload.customer,
                accounts: action.payload.accounts
            }
            
        case FETCH_CUSTOMER_ACCOUNT_REQUEST:
            return {
                ...prevState,
                loading: true,
            }
            default: return prevState;
    }
}

export default CustomerAccountReducer;