import React from "react";
import { Form, Input, Button, Checkbox, Col, Modal } from "antd";
import axios from "axios";
import httpClient from "../../utils/httpClient";
import '../employee/createCustomer.less'

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

class createCustomer extends React.Component {


    constructor(props) {
        super(props);
    }
    success(data) {
        Modal.success({
            title: "Thành công",
            content: 'Tạo tài khoản thành công!',
        });
    }

    error() {
        Modal.error({
            title: 'Tạo tài khoản thất bại',
            content: 'Email đã tồn tại. Vui lòng nhập email khác',
        });
    }
    onFinish = async (values) => {
        const result = await httpClient.post(
            "/employee/create-customer",
            values
        );
        if (result.status === "failed") this.error()
        if (result.status === "successful") this.success()
    };

    render() {
        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };
        // const layout = {
        //     labelCol: { span: 2 },
        //     wrapperCol: { span: 16 },
        // };
        return (
            // <Form
            //     {...layout}
            //     name="basic"
            //     initialValues={{ remember: true }}
            //     onFinish={this.onFinish}
            //     onFinishFailed={onFinishFailed}
            // >

            //     <Form.Item
            //         label="Họ tên"
            //         name="fullname"
            //         rules={[
            //             { required: true, message: "Vui lòng nhập họ tên" },
            //         ]}
            //     >
            //         <Input />
            //     </Form.Item>

            //     <Form.Item
            //         label="Mật khẩu"
            //         name="password"
            //         rules={[
            //             { required: true, message: "Vui lòng nhập mật khẩu" },
            //         ]}
            //     >
            //         <Input.Password />
            //     </Form.Item>

            //     <Form.Item
            //         label="Email"
            //         name="email"
            //         rules={[{ required: true, message: "Vui lòng nhập email" }]}
            //     >
            //         <Input />
            //     </Form.Item>

            //     <Form.Item
            //         label="Phone"
            //         name="Phone"
            //         rules={[
            //             {
            //                 required: true,
            //                 message: "Vui lòng nhập số điện thoại",
            //             },
            //         ]}
            //     >
            //         <Input />
            //     </Form.Item>

            //     <Col
            //         span={8}
            //         offset={8}
            //         style={{ display: "flex", justifyContent: "center" }}
            //     >
            //         <Button type="primary" htmlType="submit">
            //             Tạo tài khoản khách hàng
            //         </Button>
            //     </Col>
            //     {/* <Form.Item offset={8}>
            //         <Button type="primary" htmlType="submit">
            //             Tạo tài khoản khách hàng
            //         </Button>
            //     </Form.Item> */}
            // </Form>
            <div class="container">
                <Form id="contact" onFinish={this.onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <h3>Tạo tài khoản khách hàng mới</h3>
                    <Form.Item
                        name="fullname"
                        rules={[
                            { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                    >
                        <Input placeholder="Họ tên" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu" },
                        ]}
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="Phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại",
                            },
                        ]}
                    >
                        <Input placeholder="Điện thoại" />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginTop:"50px",fontSize:"20px"}} >
                            Tạo tài khoản khách hàng
                     </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default createCustomer;
