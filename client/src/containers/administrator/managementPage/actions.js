export function openAlertAction() {
  return {
    type: "ADMIN_OPEN_ALERT",
  }
}

export function setDataAction(data) {
  return {
    type: "ADMIN_SET_DATA",
    data
  }
}

export function startLoadingAction() {
  return {
    type: "ADMIN_START_LOADING",
  }
}

export function stopLoadingAction() {
  return {
    type: "ADMIN_STOP_LOADING",
  }
}

export function toggleModalNewEmployeeAction() {
  return {
    type: "ADMIN_TOGGLE_MODAL_EMPLOYEE"
  }
}

export function setFormDataAction(record) {
  return {
    type: "ADMIN_SET_FORM_DATA_ACTION",
    record
  }
}

export function toggleModalUpdateEmployeeAction() {
  return {
    type: "ADMIN_TOGGLE_MODAL_UPDATE_EMPLOYEE"
  }
}