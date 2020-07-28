import { combineReducers } from 'redux';
// import transactionReducer from '../containers/administrator/transactionPage';
import managementPageReducer from '../containers/administrator/managementPage/reducer';
import TransactionPageReducer from '../reducers/TransactionPageReducer';
const reducers = combineReducers({
  // transactionReducer,
  TransactionPageReducer,
  managementPageReducer
})

export default reducers;