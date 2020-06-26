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