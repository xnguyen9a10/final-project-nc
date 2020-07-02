import {
    FETCH_CUSTOMER_ACCOUNT_FAILURE,
    FETCH_CUSTOMER_ACCOUNT_REQUEST,
    FETCH_CUSTOMER_ACCOUNT_SUCCESS,
    
} from '../consts/consts';
import { getUserId } from '../../utils/auth';
import httpClient from '../../utils/httpClient';

export const fetchCustomerAccountFailure = (error) => {
    return {
        type: FETCH_CUSTOMER_ACCOUNT_FAILURE,
        payload: error
    }
}

export const fetchCustomerAccountSuccess = (data) => {
    return {
        type: FETCH_CUSTOMER_ACCOUNT_SUCCESS,
        payload: {
            customer: data.customer,
            accounts: data.accounts,
        }
    }
}

export const fetchCustomerAccountRequest = () => {
    return {
        type: FETCH_CUSTOMER_ACCOUNT_REQUEST,
    }
}
// Lay danh sach accountNumber dua vao bang user vs bang customer
export const fetchCustomerAccount = () => {
    return async (dispatch) => {
        dispatch(fetchCustomerAccountRequest());
        var obj = {
            id: getUserId(),
        }
        var customer = await httpClient.post(`/customer/get-customer`,obj);

        //  gửi đi 1 list các account của customer. 
        var paymentAcc = customer.paymentAccount.ID; // string
        var savingAccs = customer.savingAccount; // array of object {ID: "..."}
        var  accountsID= [];
        accountsID.push(paymentAcc);

        savingAccs.forEach(savingAcc => {
            accountsID.push(savingAcc.ID)
        });

        const accounts = [];

        try {
            async function getAccount(item, index){
                const response = await httpClient.post('/customer/get-account', {account: item});
                accounts.push(response);
            }
            await Promise.all(accountsID.map(getAccount));
        } catch (err) {
            dispatch(fetchCustomerAccountFailure(err))
        }

        var data = {
            customer: customer,
            accounts: accounts
        }
        dispatch(fetchCustomerAccountSuccess(data));
    }
}

