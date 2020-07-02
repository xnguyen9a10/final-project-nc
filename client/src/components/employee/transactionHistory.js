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
    const result = await httpClient.get('/employee/account-list');
    console.log(result)
    this.setState({
      accounts: result
    })
  }
  handleRowClick(id) {
    this.props.history.push(`/employee/accountHistory/${id}`);
  }
  render() {
    const { accounts } = this.state
    const dataSource = []
    for (let i = 0; i < accounts.length; i++) {
      var account = {
        key: i + 1,
        accountId: accounts[i].account_id,
        balance: accounts[i].balance,
        created_at: accounts[i].createdAt
      }
      dataSource.push(account)
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
