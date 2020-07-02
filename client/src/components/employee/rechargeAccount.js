import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';

class rechargeAccount extends React.Component {
  constructor(props) {
    super(props);
  }
  onFinish = async (values) => {
    const result = await httpClient.post('/employee/recharge-account', values);
    console.log(values)
  };
  render() {
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Số tài khoản"
          name="accountnumber"
          rules={[{ required: true, message: "Vui lòng nhập số tài khoản!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số tiền nạp"
          name="amount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền cần nạp" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận nạp tiền
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default rechargeAccount;
