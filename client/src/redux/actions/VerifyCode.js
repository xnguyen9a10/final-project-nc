import {
    VERIFY_CODE_REQUEST,
    VERIFY_CODE_SUCCESS,
    VERIFY_CODE_FAILURE,
} from '../consts/consts';
import { getUserId, getEmail } from '../../utils/auth';
import httpClient from '../../utils/httpClient';

export const VerifyFailure = (error) => {
    return {
        type: VERIFY_CODE_FAILURE,
        payload: error
    }
}

export const VerifySuccess = () => {
    return {
        type: VERIFY_CODE_SUCCESS,
        payload: true
    }
}

export const VerifyRequest = () => {
    return {
        type: VERIFY_CODE_REQUEST,
    }
}


export const VerifyCode = (code,receiverAccountNumber,amount,requestResult) => {
    return async (dispatch) => {
        dispatch(VerifyRequest());
        var data = {
            accountHolderNumber:requestResult.accountHolderNumber,
            code: code,
            email: getEmail(),
            receiverAccountNumber,
            amount
        }
        try {
            var result = await httpClient.post('/customer/verify-transfer', data);
            if (result.status == "successful") {
                var result = await httpClient.post('/customer/transactions', requestResult);
                if(result.status==="successful") dispatch(VerifySuccess());
            }
            else{
                dispatch(VerifyFailure(result))
            }
        } catch (err) {
            dispatch(VerifyFailure(err.message))
        }
    }
}

