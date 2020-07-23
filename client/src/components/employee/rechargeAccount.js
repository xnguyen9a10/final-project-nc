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

     success(data) {
        Modal.success({
          title:"Thành công",  
          content: 'Nạp tiền thành công!',
        });
      }

       error() {
        Modal.error({
          title: 'Thất bại',
          content: 'Tài khoản không tồn tại',
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
        const result = await httpClient.post(
            "/employee/recharge-account",
            values
        );
        if(result==="Nạp tiền thành công") this.success()
        if(result==="Tài khoản không tồn tại") this.error()
    };

    

    render() {
        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };
        return (
            // <Form
            //     {...layout}
            //     name="basic"
            //     initialValues={{ remember: true }}
            //     onFinish={this.onFinish}
            //     onFinishFailed={onFinishFailed}
            // >
            //     <Form.Item
            //         label="Số tài khoản"
            //         name="accountnumber"
            //         rules={
            //         [
            //             {
            //                 required: true,
            //                 message: "Vui lòng nhập số tài khoản!",
            //             }
            //         ]
            //     }
            //     >
            //         <Input/>
            //     </Form.Item>

            //     <Form.Item
            //         label="Số tiền nạp"
            //         name="amount"
            //         rules={[
            //             {
            //                 required: true,
            //                 message: "Vui lòng nhập số tiền cần nạp",
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
            //         <Button type="primary" htmlType="submit"
            //         >
            //             Nạp tiền vào tài khoản
            //         </Button>
            //     </Col>
            //     {/* <Form.Item>
            //         <Button type="primary" htmlType="submit">
            //             Xác nhận nạp tiền
            //         </Button>
            //     </Form.Item> */}
               
            // </Form>
            <div class="container">
                <Form id="contact" onFinish={this.onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <h3>Nạp tiền vào tài khoản</h3>
                    <Form.Item
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
                    <Input placeholder="Số tài khoản"/>
                </Form.Item>

                <Form.Item
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số tiền cần nạp",
                        },
                    ]}
                >
                    <Input placeholder="Số tiền nạp"/>
                </Form.Item>

                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginTop:"50px",fontSize:"20px"}} >
                            Nạp tiền vào tài khoản
                     </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default rechargeAccount;
