import React from "react";
import { Form, Input, Button, Checkbox, Table } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';
import { Link,withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";

class transactionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {}
    }
    this.handleRowClick = this.handleRowClick.bind(this)
  }
  async componentDidMount() {
    const result = await httpClient.get('/customer/account-list');
    console.log(result)
    this.setState({
      accounts: result
    })
  }
  handleRowClick(id) {
    this.props.history.push(`/accountHistory/${id}`);
  }
  render() {
    const { accounts } = this.state
    const dataSource = []
    console.log(accounts)
    const {paymentAccount,savingAccount}=accounts
    console.log(savingAccount)
    if(paymentAccount!=null){
    var account = {
          key: 0,
          accountId: paymentAccount[0].account_id,
          balance: paymentAccount[0].balance,
          created_at: paymentAccount[0].createdAt,
          type:"Thanh toán"
        }
    dataSource.push(account)
    }
    if(savingAccount!=null){
    console.log(savingAccount)
    for (let i = 0; i < savingAccount.length; i++) {
      if(savingAccount[i][0]!=null){
      var account = {
        key: i + 1,
        accountId: savingAccount[i][0].account_id,
        balance: savingAccount[i][0].balance,
        created_at: savingAccount[i][0].createdAt,
        type:"Tiết kiệm"
      }
      dataSource.push(account)
    }
  }
    }
    const columns = [
      {
        title: 'STT',
        dataIndex: 'key',
        key: 'stt',
      },
      {
        title: 'Số tài khoản',
        dataIndex: 'accountId',
        key: 'accountId',
      },
      {
        title: 'Số dư',
        dataIndex: 'balance',
        key: 'balance',
      },
      {
          title:'Loại',
          dataIndex:'type',
          key:'type'
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        key: 'created_at'
      }
    ];


    return (
      <Table dataSource={dataSource} columns={columns}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              this.handleRowClick(record.accountId)
            }, // click row
          };
        }} />
    );
  }
}
export default transactionHistory;