import React from "react";
import { Form, Input, Button, Checkbox,Table } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';

class transactionHistory extends React.Component {
    constructor(props) {
      super(props);
    }
   
    render() {
        const dataSource = [
            {
              key: '1',
              name: 'Mike',
              age: 32,
              address: '10 Downing Street',
            },
            {
              key: '2',
              name: 'John',
              age: 42,
              address: '10 Downing Street',
            },
          ];
          
          const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address',
            },
          ];
      return (
        <Table dataSource={dataSource} columns={columns} />
      );
    }
  }
  export default transactionHistory;
  