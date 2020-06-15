import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';

class createCustomer extends React.Component {
  constructor(props) {
    super(props);
  }
  onFinish = async (values) => {
    // const result = await axios.post(
    //   "http://localhost:3001/employee/create-customer",
    //   values
    // );
    const result = await httpClient.post('/employee/create-customer', values);
    if (result && result.status === "sucessful") {
    //   this.setState({ user: res.data })
    }
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
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="fullname"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="Phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo tài khoản khách hàng
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default createCustomer;
