import React from "react";
import { Form, Input, Button, Checkbox, Col, Modal } from "antd";
import axios from "axios";
import httpClient from "../../utils/httpClient";

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
    state = { visible: false };

    constructor(props) {
        super(props);
    }

     success(data) {
        Modal.success({
          title:"Thành công",  
          content: data,
        });
      }

      error(message){
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
        
            const result = await httpClient.post('customer/change-password', values);
            console.log(result)
            if(result.status==="failed") return this.error(result.err)
            else if(result.status==="successful") return this.success(result.data)
    };

    

    render() {
        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };
        return (
            <div class="container">
                <Form id="contact" onFinish={this.onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <h3>Thay đổi mật khẩu</h3>
                    <Form.Item
                    name="oldpassword"
                    rules={
                    [
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu cũ!",
                        }
                    ]
                }
                >
                    <Input type="password" placeholder="Nhập mật khẩu cũ"/>
                </Form.Item>

                <Form.Item
                    name="confirmpassword"
                    rules={
                    [
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu cũ!",
                        }
                    ]
                }
                >
                    <Input type="password" placeholder="Xác nhận mật khẩu"/>
                </Form.Item>
                

                <Form.Item
                    name="newpassword"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới",
                        },
                    ]}
                >
                    <Input type="password" placeholder="Nhập mật khẩu mới"/>
                </Form.Item>

                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginTop:"50px",fontSize:"20px", padding:5}} >
                            Đổi mật khẩu
                     </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default ChangePassword;
