import {
    CUSTOMER_TRANSFER_FAILURE,
    CUSTOMER_TRANSFER_REQUEST,
    CUSTOMER_TRANSFER_SUCCESS, 
} from '../consts/consts';
import { getUserId } from '../../utils/auth';
import httpClient from '../../utils/httpClient';

export const TransferFailure = (error) => {
    return {
        type: CUSTOMER_TRANSFER_FAILURE,
        payload: error
    }
}

export const TransferSuccess = (data) => {
    return {
        type: CUSTOMER_TRANSFER_SUCCESS,
        payload: data
    }
}

export const TransferRequest = () => {
    return {
        type: CUSTOMER_TRANSFER_REQUEST,
    }
}


export const Transfer = (data) => {
    return async (dispatch) => {
        dispatch(TransferRequest());
        data.transferAt = Date.now();
        console.log(data)

        try {
            var result = await httpClient.post('/customer/transactions', data);
            if (result.status == "successful") {
                dispatch(TransferSuccess(result.data));
            }
        } catch (err) {
            dispatch(TransferFailure(err.message))
        }
    }
}

