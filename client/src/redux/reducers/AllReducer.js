import { combineReducers } from 'redux'
//tổng hợp các reducer lại 
import CustomerAccountReducer from './CustomerAccountReducer';
import CustomerTransferReducer from './CustomerTransferReducer';
import CustomerRequestTransfer from './CustomerRequestTransferReducer';
import VerifyCode from './VerifyCodeReducer';
import ManagementPageReducer from './ManagementPageReducer';
import TransactionPageReducer from './TransactionPageReducer';

const AllReducer = combineReducers({
    customer: CustomerAccountReducer,
    customerTransfer: CustomerTransferReducer,
    customerRequestTransfer: CustomerRequestTransfer,
    verifyResult: VerifyCode,
    TransactionPageReducer,
    ManagementPageReducer,
})

export default AllReducer;