import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import _ from "lodash";
import history from "../../utils/history";
import axios from "axios";
import { setSession } from "../../utils/auth";
import styles from "./login.less";
import { Helmet } from "react-helmet";
import Recaptcha from "react-recaptcha";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

// class LoginComponent extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             captchaCheck: false,
//         };
//         this.verifyCallback = this.verifyCallback.bind(this);
//         this.onloadCallback = this.onloadCallback.bind(this);
//     }
//     onFinish = async (values) => {
//         const { captchaCheck } = this.state;
//         const result = await axios.post(
//             "http://localhost:3001/user/login",
//             values
//         );
//         if (!captchaCheck) {
//             alert("Vui lòng chọn captcha!");
//             return;
//         }
//         if (result.data.status === "successful") {
//             setSession(
//                 result.data.data.userCopied.id,
//                 result.data.data.accessToken,
//                 result.data.data.refreshToken
//             );
//             history.push("/");
//         }
//     };

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captchaCheck: false,
    };
    this.verifyCallback = this.verifyCallback.bind(this);
    this.onloadCallback = this.onloadCallback.bind(this);
  }
  onFinish = async (values) => {
    const { captchaCheck } = this.state;
    const result = await axios.post("http://localhost:3001/user/login", values);
    if (!captchaCheck) {
      alert("Vui lòng chọn captcha!");
      return;
    }
    if (result.data.status === "successful") {
      setSession(
        result.data.data.userCopied.id,
        result.data.data.userCopied.fullname,
        result.data.data.accessToken,
        result.data.data.refreshToken,
        result.data.data.userCopied.role,
        result.data.data.userCopied.email
      );

      if(result.data.data.userCopied.role === 'employee') {
        history.push(`/employee/create-customer`);
      } else {
        history.push(`/profile`);

      }
    }
  };

  async verifyCallback(response) {
    if (response) {
      await this.setState({
        captchaCheck: true,
      });
      console.log(this.state.captchaCheck);
    }
  }
  onloadCallback() {
    console.log(this.state.captchaCheck);
  }

  render() {
    return (
      <div
        className="row justify-content-center login-page"
        style={{
          backgroundImage:
            "url(https://cdn.wallpapersafari.com/4/2/Y8eAKl.jpg)",

          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Helmet>
          <script
            src="https://www.google.com/recaptcha/api.js"
            async
            defer
          ></script>
        </Helmet>
        <div
          className="card o-hidden border-0 shadow-lg my-5 login-warp"
          style={{
            backgroundImage:
              "url(https://lh3.googleusercontent.com/proxy/FDvdEPr-7la6-im3hsJjO-ButhBewABQtx8daMynhWypscjaWddOpprURQKasVXEBWH6oUxQAmIWgGrXS_1wLz2MmtKeENlosi33xT2RAw5btYtqD634PVgN7somSIRLkj9d_PKKUWCQGzXXcVLXBEgEKqo8_sbMBIphgYAQ",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Form
            name="normal_login"
            className="login-form mt-10"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                className="form-group"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
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
                className="recaptcha"
              />
            </Form.Item>
            <Form.Item className="login-btn">
              <Button
                type="primary"
                htmlType="submit"
                className="btn btn-primary btn-block"
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

//   onloadCallback() {
//     console.log(this.state.captchaCheck)
//   }

//   render() {
//     return (

//  <div className="row justify-content-center">
//       <Helmet>
//         <script src="https://www.google.com/recaptcha/api.js" async defer></script>
//       </Helmet>
//       <div className="card o-hidden border-0 shadow-lg my-5">
//         <Form
//           name="normal_login"
//           className="login-form mt-10"
//           initialValues={{ remember: true }}
//           onFinish={this.onFinish}
//         >
//           <Form.Item
//             name="email"
//             rules={[
//               { required: true, message: "Please input your Email!" },
//             ]}
//           >
//             <Input
//               prefix={<UserOutlined className="site-form-item-icon" />}
//               placeholder="Email"
//             />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             rules={[
//               { required: true, message: "Please input your Password!" },
//             ]}
//           >
//             <Input
//               prefix={<LockOutlined className="site-form-item-icon" />}
//               type="password"
//               placeholder="Password"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Recaptcha
//               sitekey="6LfYOqoZAAAAAE5-AOkmltvfagYT1cQiF3nBJ175"
//               render="explicit"
//               verifyCallback={this.verifyCallback}
//               onloadCallback={this.onloadCallback}
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="login-form-button"
//             >
//               Log in
//                 </Button>
//           </Form.Item>
//           <Form.Item>
//             <a className="login-form-forgot" href="">
//               Forgot password
//                 </a>
//           </Form.Item>

//         </Form>
//       </div>
// //           </div>
//     )
//   }
export default LoginComponent;
