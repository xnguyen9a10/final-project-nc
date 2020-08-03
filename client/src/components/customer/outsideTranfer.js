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
      otp: "",
      modalOTP: "",
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

  onSubmit = async (value) => {
    this.setState({ modalOTP: true });

    const body = {
      receiverAccountNumber: this.state.toAccountNumber,
      email: localStorage.getItem("email"),
      isOutside: true
    };
    const result = await httpClient.post("customer/transfer-request", body);
  };

  onSubmitCode = async () => {
    const body = {
      fromAccountNumber: this.state.fromAccountNumber,
      toAccountNumber: this.state.toAccountNumber,
      senderName: localStorage.getItem("userName"),
      receiverName: this.state.fullname,
      amount: this.state.amount,
      content: this.state.content,
      fee: this.state.fee === "nguoigui" ? true : false,
      otp: this.state.otp
    };
    const seft = this;

    if (this.state.bank === "rsa") {
      const result = await httpClient.post("/api/transfer/rsagroup", body);
      if (result.status === "successful") {
        Modal.success({
          content: "Chuyển khỏan thành công",
          onOk() {
            seft.showModal();
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
            seft.showModal();
          },
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
      account_id: this.state.toAccountNumber,
    };
    if (this.state.tengoinho !== "") {
      const result = await httpClient.post("/api/tengoinho", body);
      console.log(result);
    }

    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  confirmOTP = async () => {
    const body = {
      code: this.state.otp,
      email: localStorage.getItem("email"),
      receiverAccountNumber: this.state.toAccountNumber,
      amount: this.state.amount,
    };

    this.onSubmitCode();
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <Card title="CHUYỂN KHOẢN NGOÀI HỆ THỐNG" style={{ height: "100vh" }}>
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
        {/* <Col span={6}>
          <Card>
            <p>
              {" "}
              Chuyển tiền liên ngân hàng là một trong những dịch vụ tiện ích mà
              các ngân hàng cung cấp đến người sử dụng. Tuy nhiên, hiện nay cũng
              có không ít thắc mắc về dịch vụ này, nhất là với những khách hàng
              lần đầu tiên sử dụng thẻ ngân hàng. Vậy chuyển khoản liên ngân
              hàng là gì? Mất bao lâu mới nhận được tiền và có nên sử dụng dịch
              vụ không?
              {"\n"}
            </p>
            <br />
            Chuyển tiền tới ngân hàng khác nhanh chóng, không cần đến quầy giao
            dịch làm thủ tục, phù hợp với người bận rộn vì giúp tiết kiệm thời
            gian. Giao dịch có thể thực hiện mọi nơi như ngay tại nhà, khi đi du
            lịch, đi chơi… thông qua Internet Banking hoặc Mobile Banking.<br /> Có
            thể giao dịch ngoài giờ hành chính, cuối tuần, các ngày lễ tết. Hạn
            mức chuyển tiền lớn, phù hợp với khách hàng có nhu cầu chuyển khoản
            thường xuyên. Có mức phí giao dịch cố định dù chuyển tiền sang ngân
            hàng khác trong cùng tỉnh/thành phố hay khác tỉnh/thành phố. Nếu sử
            dụng hình thức chuyển khoản nhanh, có thể nhận được tiền gần như
            ngay lập tức. Dịch vụ chuyển tiền có tính bảo mật cao vì khi thực
            hiện giao dịch sẽ có một mã OTP gửi về điện thoại. <br />Khi thực hiện
            giao dịch, hệ thống ngân hàng sẽ hiển thị tình trạng giao dịch: Đã
            thành công, giao dịch không thành công hay giao dịch đang được xử
            lý. Vì vậy bạn có thể chủ động nắm rõ về hoạt động thanh toán của
            mình. Nếu giao dịch không thành công, tài khoản của khách hàng sẽ
            được hoàn tiền lại.
          </Card>
        </Col> */}
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

        <Modal
          title="Xác nhận giao dịch !"
          visible={this.state.modalOTP}
          onOk={this.confirmOTP}
          onCancel={() => this.setState({ modalOTP: false })}
        >
          <Form>
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Hãy nhập mã OTP!" }]}
            >
              <p>
                Mã OTP đã được gửi đến email của bạn, hãy kiểm tra và điền vào
                dưới đây{" "}
              </p>
              <Input
                onChange={(e) => this.setState({ otp: e.target.value })}
                placeholder="Nhập mã OTP"
                validateStatus="warning"
              />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    );
  }
}
