import { combineReducers } from 'redux';
// import transactionReducer from '../containers/administrator/transactionPage';
import managementPageReducer from '../containers/administrator/managementPage/reducer';
console.log(managementPageReducer)
const reducers = combineReducers({
  // transactionReducer,
  managementPageReducer
})

export default reducers;