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

class rechargeAccount extends React.Component {
    state = { visible: false };

    constructor(props) {
        super(props);
    }

    

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    onFinish = async (values) => {
        // this.setState({
        //     visible: true,
        // });
        this.showModal();
        this.handleOk(values)
    };

    handleOk = async(values) => {
        const result = await httpClient.post(
            "/employee/recharge-account",
            values
        );
        if(result==="Tài khoản không tồn tại")
        this.setState({
            visible: false,
        });

    };

    render() {
        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };
        return (
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Số tài khoản"
                    name="accountnumber"
                    rules={
                    [
                        {
                            required: true,
                            message: "Vui lòng nhập số tài khoản!",
                        }
                    ]
                }
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Số tiền nạp"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số tiền cần nạp",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Col
                    span={8}
                    offset={8}
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    <Button type="primary" htmlType="submit"
                    >
                        Nạp tiền vào tài khoản
                    </Button>
                </Col>
                {/* <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Xác nhận nạp tiền
                    </Button>
                </Form.Item> */}
                <Modal
                    title="Thông báo"
                    visible={this.state.visible}
                    onOk={()=>this.handleOk()}
                    onCancel={this.handleCancel}
                >
                    <p>Xác nhận nạp tiền ?</p>
                </Modal>
            </Form>
        );
    }
}
export default rechargeAccount;
