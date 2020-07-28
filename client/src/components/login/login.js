import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import _ from "lodash";
import history from '../../utils/history';
import axios from 'axios';
import { setSession } from '../../utils/auth';
import styles from "./login.less";
import { Helmet } from "react-helmet";
import Recaptcha from 'react-recaptcha'
import {Link} from "react-router-dom"

class LoginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      captchaCheck: false
    }
    this.verifyCallback = this.verifyCallback.bind(this)
    this.onloadCallback = this.onloadCallback.bind(this)
  }
  onFinish = async (values) => {
    const { captchaCheck } = this.state
    const result = await axios.post("http://localhost:3001/user/login", values)
    if (!captchaCheck) {
      alert("Vui lòng chọn captcha!");
      return
    }
    if (result.data.status === 'successful') {
      setSession(result.data.data.userCopied.id, 
        result.data.data.userCopied.fullname, 
        result.data.data.accessToken,
         result.data.data.refreshToken, 
         result.data.data.userCopied.role,
         result.data.data.userCopied.email);
      
      if (result.data.data.userCopied.role === 'employee') {
        history.push("/employee/create-customer")
      }
      if (result.data.data.userCopied.role === 'customer') {
        history.push("/customer/profile")
      }
      if (result.data.data.userCopied.role === 'administrator') {
        history.push("/admin/management")
      }
    }
  };

  async verifyCallback(response) {
    if (response) {
      await this.setState({
        captchaCheck: true
      })
      console.log(this.state.captchaCheck)
    }
  }
  onloadCallback() {
    console.log(this.state.captchaCheck)
  }

  render() {
    return (

 <div className="row justify-content-center">
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </Helmet>
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
            <Recaptcha
              sitekey="6LfYOqoZAAAAAE5-AOkmltvfagYT1cQiF3nBJ175"
              render="explicit"
              verifyCallback={this.verifyCallback}
              onloadCallback={this.onloadCallback}
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
            {/* <a className="login-form-forgot" href=""> */}
            <Link to="/forget-password">Forgot password</Link>
              
                {/* </a> */}
          </Form.Item>

        </Form>
      </div>
          </div>
    )
  }
}
export default LoginComponent;