import { createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
// 2 cái này là 2 cái middleware
import thunk from 'redux-thunk' 
import logger from 'redux-logger' 
import AllReducer from '../reducers/AllReducer';

const store = createStore(AllReducer, composeWithDevTools(applyMiddleware(thunk,logger)))
export default store;
