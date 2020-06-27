import { combineReducers } from 'redux';

const initState = {
  isAlertOpen : false,
}

function transactionReducer(state = initState, action) {
  const newState = _.cloneDeep(state);

  switch(action.type) {
    case 'ADMIN_OPEN_ALERT': {
      newState.isAlertOpen = true;
      return newState
    }
    default:
      return state;
  }
}

export default transactionReducer