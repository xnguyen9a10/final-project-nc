import React from "react";
import { Form, Input, Button, Checkbox,Table } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';
import { Link } from "react-router-dom";
import { Tabs, Radio } from 'antd';
const { TabPane } = Tabs;

class accountHistory extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        size:"small",
        transferHistory:{},
        receiveHistory:{},
        paymentHistory:{}
      }
    }
    
    async componentDidMount(){
      console.log(this.props.match.params.accountId)
      const accountId=this.props.match.params.accountId
      const transferList = await httpClient.get(`/employee/transfer-history/${accountId}`);
      const receiveList = await httpClient.get(`/employee/receive-history/${accountId}`);
      const paymentList = await httpClient.get(`/employee/payment-history/${accountId}`);

      this.setState({
        transferHistory:transferList,
        receiveHistory:receiveList,
        paymentHistory:paymentList
      })
    }

    createTransferTable(){
      const {transferHistory}=this.state
      console.log(transferHistory)
      const dataSource = []
    for (let i = 0; i < transferHistory.length; i++) {
      var transfer = {
        key: i + 1,
        receiverAccountNumber: transferHistory[i].receiverAccountNumber,
        transferAmount: transferHistory[i].transferAmount,
        content : transferHistory[i].content,
        transferAt: transferHistory[i].transferAt
      }
      dataSource.push(transfer)
    }
    const columns = [
      {
        title: 'STT',
        dataIndex: 'key',
        key: 'stt',
      },
      {
        title: 'Số tài khoản người nhận',
        dataIndex: 'receiverAccountNumber',
        key: 'receiverAccountNumber',
      },
      {
        title: 'Số tiền chuyển',
        dataIndex: 'transferAmount',
        key: 'transferAmount',
      },
      {
        title:'Nội dung giao dịch',
        dataIndex:'content',
        key:'content'
      },
      {
        title: 'Ngày giao dịch',
        dataIndex: 'transferAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(b.transferAt) - new Date(a.transferAt),
        key: 'transferAt'
      }
    ];
    return {dataSource,columns}
    }

    createReceiveTable(){
      const {receiveHistory}=this.state
      console.log(receiveHistory)
      const dataSource = []
    for (let i = 0; i < receiveHistory.length; i++) {
      var receiver = {
        key: i + 1,
        accountHolderNumber: receiveHistory[i].accountHolderNumber,
        transferAmount: receiveHistory[i].transferAmount,
        content : receiveHistory[i].content,
        transferAt: receiveHistory[i].transferAt
      }
      dataSource.push(receiver)
    }
    const columns = [
      {
        title: 'STT',
        dataIndex: 'key',
        key: 'stt',
      },
      {
        title: 'Số tài khoản người gửi',
        dataIndex: 'accountHolderNumber',
        key: 'accountHolderNumber',
      },
      {
        title: 'Số tiền nhận',
        dataIndex: 'transferAmount',
        key: 'transferAmount',
      },
       {
        title:'Nội dung giao dịch',
        dataIndex:'content',
        key:'content'
       },
      {
        title: 'Ngày giao dịch',
        dataIndex: 'transferAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(b.transferAt) - new Date(a.transferAt),
        key: 'transferAt'
      }
    ];
    return {dataSource,columns}
    }

    createPaymentTable(){
      const {paymentHistory}=this.state
      console.log(paymentHistory)
      const dataSource = []
    for (let i = 0; i < paymentHistory.length; i++) {
      var payment = {
        key: i + 1,
        receiverAccountNumber: paymentHistory[i].receiverAccountNumber,
        transferAmount: paymentHistory[i].transferAmount,
        content : paymentHistory[i].content,
        transferAt: paymentHistory[i].transferAt
      }
      dataSource.push(payment)
    }
    const columns = [
      {
        title: 'STT',
        dataIndex: 'key',
        key: 'stt',
      },
      {
        title: 'Số tài khoản cần trả',
        dataIndex: 'receiverAccountNumber',
        key: 'receiverAccountNumber',
      },
      {
        title: 'Số tiền nợ đã thanh toán',
        dataIndex: 'transferAmount',
        key: 'transferAmount',
      },
       {
        title:'Nội dung giao dịch',
        dataIndex:'content',
        key:'content'
       },
      {
        title: 'Ngày giao dịch',
        dataIndex: 'transferAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(b.transferAt) - new Date(a.transferAt),
        key: 'transferAt'
      }
    ];
    return {dataSource,columns}
    }

    render() {
      const { size } = this.state;
      const transferTable=this.createTransferTable()
      const receiverTable=this.createReceiveTable()
      const paymentTable=this.createPaymentTable()
      return (
        <div>
        <Tabs defaultActiveKey="1" type="card" size={size}>
          <TabPane tab="Lịch sử chuyển tiền" key="1">
            <Table dataSource={transferTable.dataSource} columns={transferTable.columns}></Table>
          </TabPane>
          <TabPane tab="Lịch sử nhận tiền" key="2">
          <Table dataSource={receiverTable.dataSource} columns={receiverTable.columns}></Table>
          </TabPane>
          <TabPane tab="Lịch sử thanh toán nhắc nợ" key="3">
          <Table dataSource={paymentTable.dataSource} columns={paymentTable.columns}></Table>
          </TabPane>
        </Tabs>
       </div>
      );
    }
  }
  export default accountHistory;
  