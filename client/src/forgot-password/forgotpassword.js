import React from "react";
import { Form, Input, Button, Checkbox, Col, Modal } from "antd";
import axios from "axios";
import httpClient from "../utils/httpClient";
import { values } from "lodash";
import { useHistory } from "react-router-dom";

const layout = {
    labelCol: {
        span: 3,
        offset: 6,
    },
    wrapperCol: {
        span: 8,
    },
    labelAlign: "left",
};

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailForm: false,
            verifyForm: true,
            changePasswordForm: true,
            email:null
        }
    }

    success(data) {
        Modal.success({
            title: "Thành công",
            content: data,
        });
    }

    error(message) {
        Modal.error({
            title: 'Thất bại',
            content: message,
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    onFinish = async (values) => {
        console.log(values)
        const result = await httpClient.post('user/reset-password', values);
        console.log(result)
        if (result.status === "failed") return this.error(result.err)
        else if (result.status === "successful") {
            this.setState({
                emailForm: true,
                verifyForm: false,
                email:values.resetemail
            })
            return this.success(result.data)
        }
    };

    onVerifycode=async(values)=>{
        const email=this.state.email
        values["email"]=email
        const result = await httpClient.post('user/verify-forget-password', values);
        if (result.status === "failed") return this.error(result.err)
        else if (result.status === "successful") {
            this.setState({
                emailForm: true,
                verifyForm: true,
                changePasswordForm:false
            })
            return this.success(result.data)
        }
    }


    onChangePassword=async(values)=>{
        const email=this.state.email
        values["email"]=email
        const result = await httpClient.post('user/change-password', values);
        if (result.status === "failed") return this.error(result.err)
        else if (result.status === "successful") {
            this.setState({
                emailForm: false,
                verifyForm: true,
                changePasswordForm:true,
                email:null
            })
            this.props.history.push("/login");
            return this.success(result.data)
        }
    }



    render() {
        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };
        const { emailForm, verifyForm, changePasswordForm,email } = this.state
        console.log(email)
        return (
            <div class="container">
                <Form id="contact" onFinish={this.onFinish}
                    onFinishFailed={onFinishFailed}
                    hidden={emailForm}
                >
                    <h3>Quên mật khẩu</h3>
                    <Form.Item
                        name="resetemail"
                        rules={
                            [
                                {
                                    required: true,
                                    message: "Vui lòng nhập email",
                                }
                            ]
                        }
                    >
                        <Input type="text" placeholder="Nhập email đã đăng kí để reset mật khẩu" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ fontSize: "20px", height: "50px" }} >
                            Xác nhận email
                     </Button>
                    </Form.Item>
                </Form>
                <Form id="contact" onFinish={this.onVerifycode}
                    onFinishFailed={onFinishFailed}
                    hidden={verifyForm}
                    style={{ marginTop: "50px" }
                }
                >
                    <Form.Item
                        name="verifycode"
                        rules={
                            [
                                {
                                    required: true,
                                    message: "Vui lòng nhập mã xác thực",
                                }
                            ]

                        }
                    >
                        <Input type="text" style={{ fontSize: "20px", height: "50px",fontWeight:"bold" }}
                            placeholder="Nhập mã xác thực đã được gửi đến email của bạn." />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ fontSize: "20px", height: "50px" }} >
                            Xác thực
                     </Button>
                    </Form.Item>
                </Form>
                <Form id="contact" onFinish={this.onChangePassword}
                    onFinishFailed={onFinishFailed}
                    hidden={changePasswordForm}
                    style={{ marginTop: "50px" }
                }
                >
                    <Form.Item
                        name="newpassword"
                        rules={
                            [
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu mới",
                                }
                            ]

                        }
                    >
                        <Input type="password" style={{ fontSize: "20px", height: "50px",fontWeight:"bold" }}
                            placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                        name="confirmnewpassword"
                        rules={
                            [
                                {
                                    required: true,
                                    message: "Vui lòng xác nhận mật khẩu",
                                }
                            ]

                        }
                    >
                        <Input type="password" style={{ fontSize: "20px", height: "50px",fontWeight:"bold" }}
                            placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ fontSize: "20px", height: "50px" }} >
                            Tạo mật khẩu mới
                     </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default ChangePassword;
