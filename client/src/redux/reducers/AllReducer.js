import { combineReducers } from 'redux'
//tổng hợp các reducer lại 
import CustomerReducer from './CustomerReducer';

const AllReducer = combineReducers({
    customer: CustomerReducer
})

export default AllReducer;