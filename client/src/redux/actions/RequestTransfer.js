import {
    CUSTOMER_REQUEST_TRANSFER,
    CUSTOMER_REQUEST_TRANSFER_SUCCESS,
    CUSTOMER_REQUEST_TRANSFER_FAILURE
} from '../consts/consts';
import { getUserId, getEmail } from '../../utils/auth';
import httpClient from '../../utils/httpClient';

export const RequestFailure = (error) => {
    return {
        type: CUSTOMER_REQUEST_TRANSFER_FAILURE,
        payload: error
    }
}

export const RequestSuccess = () => {
    return {
        type: CUSTOMER_REQUEST_TRANSFER_SUCCESS,
    }
}

export const SendRequest = (data) => {
    return {
        type: CUSTOMER_REQUEST_TRANSFER,
        payload: data
    }
}

export const RequestTransfer = (data) => {
    return async (dispatch) => {
        dispatch(SendRequest(data));
        var obj = {
            email: getEmail(),
        }
        try {
            var result = await httpClient.post("/customer/transfer-request", obj);
            if (result.status == "successful") {
                dispatch(RequestSuccess());
            }
        } catch (err) {
            dispatch(RequestFailure(err.message))
        }
    }
}

