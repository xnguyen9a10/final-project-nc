import {
    SAVE_RECEIVER_FAILURE,
    SAVE_RECEIVER_REQUEST,
    SAVE_RECEIVER_SUCCESS,
    
} from '../consts/consts';
import httpClient from '../../utils/httpClient';
import { getUserId } from '../../utils/auth';

export const SaveReceiverFailure = (error) => {
    return {
        type: SAVE_RECEIVER_FAILURE,
        payload: error
    }
}

export const SaveReceiverSuccess = (data) => {
    return {
        type: SAVE_RECEIVER_SUCCESS,
        payload: data
    }
}

export const SaveReceiverRequest = () => {
    return {
        type: SAVE_RECEIVER_REQUEST,
    }
}
// Lay danh sach accountNumber dua vao bang user vs bang customer
export const SaveReceiver = (data) => {
    console.log(data)
    data = {
        ...data,
        user_id: getUserId()
    }
    return async (dispatch) => {
        dispatch(SaveReceiverRequest());

        var result = await httpClient.post(`/customer/save-receiver`,data);
        if(result.status=="successful"){
            dispatch(SaveReceiverSuccess(result))
        }
        else{
            dispatch(SaveReceiverFailure(result.message));
        }
    }
}

