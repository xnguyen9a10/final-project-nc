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
  Table,
  Tag,
  Space,
  Tabs,
  notification,
  message,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import httpClient from "../../utils/httpClient";
import _ from "lodash";
import moment from "moment";
import io from "socket.io-client";
const { TabPane } = Tabs;

let socket = io("http://localhost:3001/", {
  transports: ["websocket"],
  jsonp: false,
  reconnection: false,
});

const openNotification = (message, loinhan) => {
  notification.open({
    message: message,
    description: `${loinhan}`,
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};

export default class Debs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromAccountNumber: "",
      data: [],
      data2: [],
      receivers: [],
      toAccountNumber: "",
      fullname: "",
      recordTime: "",
      tutaikhoan: "",
      otp: "",
      idchuno: "",
      idchunochinhxac: "",
      isFromDanhba: false,
      bank: "rsa",
      sotientrano: 0,
      amount: 0,
      fee: "nguoigui",
      datathanhtoan: [],
      datachuathanhtoan: [],
      tengoinho: "",
      loinhan: "",
      loinhanhuynhacno: "",
      huynhacnoModal: false,
      tuchoinhacnoModal: false,
      idhuynhacno: "",
      sotaikhoanchuno: "",
      idtuchoinhacno: "",
      taikhoantrano: "",
      content: "",
      visible: false,
      modalOTP: false,
      notito: "",
    };
  }

  async componentDidMount() {
    socket.on("nhac_no", (data) => {
      if (data.email === localStorage.getItem("email")) {
        openNotification("Nhắc nợ thông báo", `${data.name} đã hủy nhắc nợ với lý do: ${data.loinhan}`)
      }
    });

    socket.on("thanh_toan", (data) => {
      if (data.email === localStorage.getItem("email")) {
        openNotification(
          "Thông báo",
          `${data.name} đã thanh toán khoản nợ ${data.sotien}`
        );
      }
    });

    const result = await httpClient.get("/customer/debs/1");
    const result2 = await httpClient.get("/customer/debs/2");
    console.log(result)
    const result3 = await httpClient.post("/customer/get-customer", {
      id: localStorage.getItem("userId"),
    });
    this.setState({
      fromAccountNumber:
        result3 && result3.paymentAccount && result3.paymentAccount.ID,
      receivers: result3 && result3.receivers,
    });
    this.setState({
      data: result,
      data2: result2,
      datathanhtoan: _.filter(result2, (o) => o.state === 2),
      datachuathanhtoan: _.filter(result2, (o) => o.state === 1),
    });
  }
  handleOk = async (e) => {
    const body = {
      amount: this.state.amount,
      accountNumberDeb: this.state.toAccountNumber,
      content: this.state.content,
    };
    const result = await httpClient.post("/customer/create-deb", body);
    Modal.success({
      content: "Tạo nhắc nợ thành công",
    });

    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  onSelect = (data) => {
    const a = _.filter(this.state.receivers, { nickname: data });
    this.setState({
      toAccountNumber: a[0].account_id,
      fullname: a[0].fullname,
    });
  };

  onChangeAmount = (value) => {
    this.setState({ amount: value });
  };

  onChangesotaikhoan = async (value) => {
    this.setState({ toAccountNumber: value });
    if (value.length === 9) {
      const result = await httpClient.post("/customer/information", {
        account_id: value,
      });
      this.setState({ fullname: result.fullname });
    }
  };
  confirm = () => {
    const seft = this;
    Modal.confirm({
      title: "Hủy nhắc nợ",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có muốn hủy nhắc nợ",
      okText: "Xác nhận",
      cancelText: "Quay lại",
      async onOk() {
        const result = await httpClient.post("customer/reject-deb", {
          deb_id: seft.state.idhuynhacno,
          content: seft.state.loinhanhuynhacno,
        });

        const result2 = await httpClient.post('/customer/information', {
          account_id: seft.state.sotaikhoanchuno
        })
      
        socket.emit("nhac_no", {
          email: result2.email,
          name: localStorage.getItem("userName"),
          loinhan: seft.state.loinhanhuynhacno,
        });
      },
    });
  };

  confirmTuchoinhacno = () => {
    const seft = this;

    Modal.confirm({
      title: "Hủy nhắc nợ",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có muốn hủy nhắc nợ",
      okText: "Xác nhận",
      cancelText: "Quay lại",
      async onOk() {
        const result = await httpClient.post("customer/reject-deb", {
          deb_id: seft.state.idtuchoinhacno,
          content: seft.state.loinhan,
        });

        const result2 = await httpClient.post('/customer/information', {
          account_id: seft.state.tutaikhoan
        })
        
        socket.emit("nhac_no", {
          email: result2.email,
          name: localStorage.getItem("userName"),
          loinhan: seft.state.loinhan,
        });
      },
    });
  };

  onPressHuyNhacno = (id, accountNumberDeb) => {
    this.setState({
      huynhacnoModal: true,
      idhuynhacno: id,
      sotaikhoanchuno: accountNumberDeb,
    });
  };

  onPressTuchoinhacno = (id, accountNumberDeb) => {
    this.setState({
      tuchoinhacnoModal: true,
      idtuchoinhacno: id,
      tutaikhoan: accountNumberDeb
    });
  };

  confirmOTP = async () => {
    const body = {
      code: this.state.otp,
      email: localStorage.getItem("email"),
      receiverAccountNumber: this.state.taikhoantrano,
      amount: this.state.sotientrano,
    };
    await httpClient.post("/customer/verify-transfer", body);

    await httpClient.post("/customer/transactions", {
      isPayment: true,
      accountHolderNumber: this.state.fromAccountNumber,
      transferAmount: this.state.sotientrano,
      content: "Tra no",
      isPayFee: true,
      receiverAccountNumber: this.state.taikhoantrano
    });

    const result = await httpClient.post("customer/solve-deb", {
      deb_id: this.state.idchuno,
      time: this.state.recordTime
    });

    socket.emit("thanh_toan", {
      email: this.state.idchunochinhxac,
      name: localStorage.getItem("userName"),
      sotien: this.state.sotientrano,
    });

    Modal.success({
      content: "Thanh toán nợ thành công",
    });
  };

  onThanhtoan = async (id, toAccountNumber, amount, time) => {
    const body = {
      receiverAccountNumber: toAccountNumber,
      email: localStorage.getItem("email"),
    };

    this.setState({
      modalOTP: true,
      taikhoantrano: toAccountNumber,
      sotientrano: amount,
      idchuno: id,
      recordTime: time
    });
    const result2 = await httpClient.post('/customer/information', {
      account_id: toAccountNumber
    })
    const result = await httpClient.post("customer/transfer-request", body);
    this.setState({idchunochinhxac: result2.email})
  };

  render() {
    const columns = [
      {
        title: "Tài khoản nợ",
        dataIndex: "accountNumberDeb",
        key: "accountNumberDeb",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Số tiền",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Lời nhắn",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Thời gian tạo",
        dataIndex: "time",
        key: "time",
        render: (text) => moment.unix(text / 1000).format("DD/MM/YYYY"),
      },
      {
        title: "Action",
        key: "_id",
        render: (text, record) => {
          return (
            <Space size="middle">
              {/* <a>Invite {record.name}</a> */}
              {console.log(record)}
              {record.state !== 2 ? (
                <Button
                  type="primary"
                  danger
                  onClick={() => this.onPressHuyNhacno(record._id, record.accountNumberDeb)}
                >
                  Hủy
                </Button>
              ) : (
                <Tag color="green">Đã thanh toán</Tag>
              )}
            </Space>
          );
        },
      },
    ];

    const columns2 = [
      {
        title: "Từ tài khoản",
        dataIndex: "accountNumberDeb",
        key: "accountNumberDeb",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Số tiền",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Lời nhắn",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Thời gian tạo",
        dataIndex: "time",
        key: "time",
        render: (text) => moment.unix(text / 1000).format("DD/MM/YYYY"),
      },
      {
        title: "",
        key: "_id",
        render: (text, record) => {
          return (
            <Space size="middle">
              {console.log(record)}
              {record.state === 2 && <Tag color="green">Đã thanh toán</Tag>}
              {record.state === 1 && (
                <>
                  <Button
                    type="primary"
                    danger
                    onClick={() => this.onPressTuchoinhacno(record._id, record.accountNumberDeb)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    onClick={() =>
                      this.onThanhtoan(
                        record._id,
                        record.accountNumberDeb,
                        record.amount,
                        record.time
                      )
                    }
                  >
                    Thanh toán
                  </Button>
                </>
              )}
            </Space>
          );
        },
      },
    ];

    return (
      <Row>
        <Col span={12}>
          <Card
            title="Danh sách nợ đã tạo"
            // extra={
            //   <Button
            //     type="primary"
            //     onClick={() => this.setState({ visible: true })}
            //   >
            //     Tạo nhắc nợ
            //   </Button>
            // }
            style={{ height: "100vh" }}
          >
             <Button
                type="primary"
                style={{marginBottom: 29}}
                onClick={() => this.setState({ visible: true })}
              >
                Tạo nhắc nợ
              </Button>
            <Table
              pagination={{ pageSize: 8 }}
              columns={columns}
              dataSource={this.state.data}
              indentSize={8}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Danh sách nhắc nợ được nhận" style={{ height: "100vh" }}>
            <Tabs defaultActiveKey="1" onChange={() => console.log("chjgetab")}>
              <TabPane tab="Đã xử lý" key="1">
                <Table
                  pagination={{ pageSize: 8 }}
                  columns={columns2}
                  dataSource={this.state.datathanhtoan}
                />
              </TabPane>
              <TabPane tab="Chưa xử lý" key="2">
                <Table
                  pagination={{ pageSize: 8 }}
                  columns={columns2}
                  dataSource={this.state.datachuathanhtoan}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Modal
          title="Tạo nhắc nợ"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            labelCol={{
              span: 7,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            initialValues={{
              size: "large",
            }}
          >
            <Form.Item label="Từ danh bạ">
              <Row>
                <Col xs={4} offset={0}>
                  <Switch
                    defaultChecked={this.state.isFromDanhba}
                    onChange={(value) => this.setState({ isFromDanhba: value })}
                  />
                </Col>
                <Col xs={17} offset={2}>
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
            <Form.Item label="Số tài khoản nợ">
              <Input
                value={this.state.toAccountNumber}
                onChange={(value) =>
                  this.onChangesotaikhoan(value.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Chủ tài khoản">
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
          </Form>
        </Modal>

        <Modal
          title="Hủy nhắc nợ !"
          visible={this.state.huynhacnoModal}
          onOk={this.confirm}
          onCancel={() => this.setState({ huynhacnoModal: false })}
        >
          <Input.TextArea
            onChange={(e) =>
              this.setState({ loinhanhuynhacno: e.target.value })
            }
            placeholder="Hãy để lại lời nhắn"
          />
        </Modal>

        <Modal
          title="Hủy nhắc nợ !"
          visible={this.state.tuchoinhacnoModal}
          onOk={this.confirmTuchoinhacno}
          onCancel={() => this.setState({ tuchoinhacnoModal: false })}
        >
          <Input.TextArea
            onChange={(e) => this.setState({ loinhan: e.target.value })}
            placeholder="Hãy để lại lời nhắn"
          />
        </Modal>

        <Modal
          title="Xác nhận giao dịch !"
          visible={this.state.modalOTP}
          onOk={this.confirmOTP}
          onCancel={() => this.setState({ modalOTP: false })}
        >
          <>
            <p>
              Mã OTP đã được gửi đến email của bạn, hãy kiểm tra và điền vào
              dưới đây{" "}
            </p>
            <Input
              onChange={(e) => this.setState({ otp: e.target.value })}
              placeholder="Nhập mã OTP"
            />
          </>
        </Modal>
      </Row>
    );
  }
}
