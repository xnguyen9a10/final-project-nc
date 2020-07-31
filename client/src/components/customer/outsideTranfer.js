import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Row,
  Col,
  Card,
  AutoComplete,
  Modal,
} from "antd";
import httpClient from "../../utils/httpClient";
import _ from "lodash";

export default class TransferOutside extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromAccountNumber: "",
      receivers: [],
      toAccountNumber: "",
      fullname: "",
      isFromDanhba: false,
      bank: "rsa",
      amount: 0,
      fee: "nguoigui",
      tengoinho: "",
      content: "",
      visible: false,
    };
  }
  async componentDidMount() {
    //lay tai khoan nguon
    // const result = await httpClient.post('/admin/employee/create', data);
    const result = await httpClient.post("/customer/get-customer", {
      id: localStorage.getItem("userId"),
    });
    this.setState({
      fromAccountNumber:
        result && result.paymentAccount && result.paymentAccount.ID,
      receivers: result && result.outsideReceivers,
    });
  }

  onSelect = (data) => {
    
    const a = _.filter(this.state.receivers, { nickname: data });
    this.setState({
      toAccountNumber: a[0].account_id,
      fullname: a[0].fullname,
    });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  onChangesotaikhoan = (value) => {
    this.setState({ toAccountNumber: value }, async () => {
      console.log(this.state.bank);
      if (this.state.bank === "rsa") {
        const result = await httpClient.get("/api/rsa-group/" + value);
        console.log(result);
        this.setState({ fullname: result.data.name });
      }
      if (this.state.bank === "pgp") {
        const result = await httpClient.get("/api/pgpgroup/" + value);
        this.setState({ fullname: result.data.name });
      }
    });
  };

  onChangeAmount = (value) => {
    this.setState({ amount: value });
  };

  onSubmit = async () => {
    const body = {
      fromAccountNumber: this.state.fromAccountNumber,
      toAccountNumber: this.state.toAccountNumber,
      senderName: localStorage.getItem("userName"),
      receiverName: this.state.fullname,
      amount: this.state.amount,
      content: this.state.content,
      fee: this.state.fee === "nguoigui" ? true: false
    };
    const seft = this;

    if (this.state.bank === "rsa") {
      const result = await httpClient.post("/api/transfer/rsagroup", body);
      if (result.status === "successful") {
        Modal.success({
          content: "Chuyển khỏan thành công",
          onOk() {
            seft.showModal()
          },
        });
      } else {
        Modal.error({
          title: "Lỗi",
          content: "Hệ thống đang bận,xin thử lại sau",
        });
      }
    }
    if (this.state.bank === "pgp") {
      const result = await httpClient.post("/api/transfer/pgpgroup", body);
      if (result.status === "successful") {
        Modal.success({
          content: "Chuyển khỏan thành công",
          onOk() {
            seft.showModal()          },
        });
      } else {
        Modal.error({
          title: "Lỗi",
          content: "Hệ thống đang bận,xin thử lại sau",
        });
      }
    }
  };
  handleOk = async (e) => {
    const body = {
      nickname: this.state.tengoinho,
      fullname: this.state.fullname,
      from: this.state.bank,
      account_id: this.state.toAccountNumber
    }
    if(this.state.tengoinho !== "") {
      const result = await httpClient.post("/api/tengoinho", body);
      console.log(result);
    }

    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <Row>
        <Col span={12}>
          <Card
            title="CHUYỂN KHOẢN NGOÀI HỆ THỐNG"
            style={{ height: "100vh", width: "50vw" }}
          >
            <Form
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 14,
              }}
              layout="horizontal"
              initialValues={{
                size: "large",
              }}
              // onValuesChange={onFormLayoutChange}
              // size={componentSize}
            >
              <Form.Item label="Tài khoản nguồn">
                <Select>
                  <Select.Option value={this.state.fromAccountNumber}>
                    {this.state.fromAccountNumber}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Tên ngân hàng">
                <Select onChange={(value) => this.setState({ bank: value })}>
                  <Select.Option value="pgp">Ngân hàng PGP</Select.Option>
                  <Select.Option value="rsa">Ngân hàng RSA</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Từ danh bạ">
                <Row>
                  <Col xs={4}>
                    <Switch
                      defaultChecked={this.state.isFromDanhba}
                      onChange={(value) =>
                        this.setState({ isFromDanhba: value })
                      }
                    />
                  </Col>
                  <Col xs={20}>
                    <AutoComplete
                      style={{ width: 200 }}
                      disabled={!this.state.isFromDanhba}
                      options={_.map(this.state.receivers, (data) => {
                        return {
                          value: data.nickname,
                        };
                      })}
                      placeholder="Nhập tên gợi nhớ"
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={this.onSelect}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="Số tài khoản">
                <Input
                  disabled={this.state.isFromDanhba}
                  value={this.state.toAccountNumber}
                  onChange={(value) =>
                    this.onChangesotaikhoan(value.target.value)
                  }
                />
              </Form.Item>

              <Form.Item
                label="Chủ tài khoản"
                onChange={(value) =>
                  this.setState({ toAccountNumber: value.target.value })
                }
              >
                <Input disabled value={this.state.fullname} />
              </Form.Item>
              <Form.Item label="Số tiền">
                <Input
                  value={this.state.amount}
                  onChange={(value) => this.onChangeAmount(value.target.value)}
                />
              </Form.Item>
              <Form.Item label="Mô tả">
                <Input.TextArea
                  onChange={(e) => this.setState({ content: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Phí">
                <Select
                  defaultValue={this.state.fee}
                  onChange={(value) => this.setState({ fee: value })}
                >
                  <Select.Option value="nguoinhan">
                    Người nhận trả
                  </Select.Option>
                  <Select.Option value="nguoigui">Người gửi trả</Select.Option>
                </Select>
              </Form.Item>
              <Button
                style={{ float: "right", marginRight: 150 }}
                onClick={() => this.onSubmit()}
              >
                Xác nhận
              </Button>
            </Form>
          </Card>
        </Col>
        <Modal
          title="Thông báo"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form.Item label="Tên gợi nhớ">
            <Input
              value={this.state.tengoinho}
              onChange={(value) =>
                this.setState({ tengoinho: value.target.value })
              }
            />
          </Form.Item>
        </Modal>
      </Row>
    );
  }
}
