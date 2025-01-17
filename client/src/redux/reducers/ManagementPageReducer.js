import { combineReducers } from 'redux';
import _ from 'lodash'

const initState = {
  isAlertOpen : false,
  data: [],
  isLoading: false,
  isModalOpen: false,
  isModalUpdateOpen: false,
  form: {}
}


function managementPageReducer(state = initState, action) {
  const newState = _.cloneDeep(state);
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
    case 'ADMIN_TOGGLE_MODAL_EMPLOYEE' : {
      newState.isModalOpen = !state.isModalOpen;
      return newState;
    }
    case 'ADMIN_SET_FORM_DATA_ACTION': {
      newState.form = action.record
      return newState;
    }
    case 'ADMIN_TOGGLE_MODAL_UPDATE_EMPLOYEE': {
      newState.isModalUpdateOpen = !state.isModalUpdateOpen
      return newState
    }
    default:
      return state;
  }
}

export default managementPageReducer