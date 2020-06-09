import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import _ from "lodash";
import history from '../../utils/history';
import axios from 'axios';
import { setSession } from '../../utils/auth';
import styles from "./login.less";

class LoginComponent extends React.Component {
  onFinish = async (values) => {
    const result = await axios.post("http://localhost:3001/user/login", values)
    if(result.data.status === 'successful') {
      setSession(result.data.data.userCopied.id, result.data.data.accessToken, result.data.data.refreshToken);
      history.push("/")
    }
  };

  render() {
    return (
      <div className="row justify-content-center">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <Form
              name="normal_login"
              className="login-form mt-10"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
              </Form.Item>
              <Form.Item>
                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
              </Form.Item>

            </Form>
          </div>
        </div>
    );
  }
}

export default LoginComponent;
