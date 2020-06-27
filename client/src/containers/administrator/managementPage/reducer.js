import { combineReducers } from 'redux';
import _ from 'lodash'

const initState = {
  isAlertOpen : false,
  data: [],
  isLoading: false,
}

function managementPageReducer(state = initState, action) {
  const newState = _.cloneDeep(state);
  console.log(action)
  switch(action.type) {
    case 'ADMIN_OPEN_ALERT': {
      newState.isAlertOpen = true;
      return newState
    }
    case 'ADMIN_SET_DATA': {
      newState.data = action.data
      return newState;
    }
    case 'ADMIN_START_LOADING': {
      newState.isLoading = true;
      return newState;
    }
    case 'ADMIN_STOP_LOADING' : {
      newState.isLoading = false;
      return newState;
    }
    default:
      return state;
  }
}

export default managementPageReducer