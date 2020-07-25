import { combineReducers } from 'redux'
//tổng hợp các reducer lại 
import CustomerAccountReducer from './CustomerAccountReducer';
import CustomerTransferReducer from './CustomerTransferReducer';
import CustomerRequestTransfer from './CustomerRequestTransferReducer';
import VerifyCode from './VerifyCodeReducer';
import ManagementPageReducer from './ManagementPageReducer';


const AllReducer = combineReducers({
    customer: CustomerAccountReducer,
    customerTransfer: CustomerTransferReducer,
    customerRequestTransfer: CustomerRequestTransfer,
    verifyResult: VerifyCode,
    
    ManagementPageReducer,
})

export default AllReducer;