import React from "react";
import { Form, Input, Button, Checkbox } from 'antd';

class createCustomer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customer:{
                
            }
        };
    }
    render() {
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };

        const onFinish = values => {
            console.log('Success:', values);
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        return (
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Họ tên"
                    name="fullname"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="Email"
                    rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="Phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Tạo tài khoản khách hàng
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
export default createCustomer