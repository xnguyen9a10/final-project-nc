import { combineReducers } from 'redux'
//tổng hợp các reducer lại 
import CustomerAccountReducer from './CustomerAccountReducer';
import CustomerTransferReducer from './CustomerTransferReducer';
import CustomerRequestTransfer from './CustomerRequestTransferReducer';
import VerifyCode from './VerifyCodeReducer';


const AllReducer = combineReducers({
    customer: CustomerAccountReducer,
    customerTransfer: CustomerTransferReducer,
    customerRequestTransfer: CustomerRequestTransfer,
    verifyResult: VerifyCode
})

export default AllReducer;