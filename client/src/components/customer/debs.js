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
  Space
} from "antd";
import httpClient from "../../utils/httpClient";
import _ from "lodash";
import moment from 'moment';

const columns = [
  {
    title: 'Tài khoản nợ',
    dataIndex: 'accountNumberDeb',
    key: 'accountNumberDeb',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Lời nhắn',
    dataIndex: 'content',
    key: 'content',
  },
  // {
  //   title: 'Tags',
  //   key: 'tags',
  //   dataIndex: 'tags',
  //   render: tags => (
  //     <>
  //       {tags.map(tag => {
  //         let color = tag.length > 5 ? 'geekblue' : 'green';
  //         if (tag === 'loser') {
  //           color = 'volcano';
  //         }
  //         return (
  //           <Tag color={color} key={tag}>
  //             {tag.toUpperCase()}
  //           </Tag>
  //         );
  //       })}
  //     </>
  //   ),
  // },
  {
    title: 'Thời gian tạo',
    dataIndex: 'time',
    key: 'time',
    render: text => moment.unix(text/1000).format("DD/MM/YYYY")
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {/* <a>Invite {record.name}</a> */}
        <Button danger>Hủy</Button>
      </Space>
    ),
  },
];

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
    const result = await httpClient.get("/customer/debs/1");
    const result2 = await httpClient.get("/customer/debs/2");
    const result3 = await httpClient.post("/customer/get-customer", {
      id: localStorage.getItem("userId"),
    });
    this.setState({
      fromAccountNumber:
      result3 && result3.paymentAccount && result3.paymentAccount.ID,
      receivers: result3 && result3.receivers,
    });
    this.setState({data: result, data2: result2});
  }
  handleOk = async (e) => {
    const body = {
      amount: this.state.amount,
      accountNumberDeb: this.state.toAccountNumber,
      content: this.state.content,
    }
    // if(this.state.tengoinho !== "") {
      const result = await httpClient.post("/customer/create-deb", body);
      console.log(result);
    // }

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

  onSelect = (data) => {
    const a = _.filter(this.state.receivers, { nickname: data });
    this.setState({
      toAccountNumber: a[0].account_id,
      fullname: a[0].fullname,
    });
  }
  onChangeAmount = (value) => {
    this.setState({ amount: value });
  };


  render() {
    return (
      <Row>
        <Col span={12}>
          <Card
            title="DANH SÁCH NỢ ĐÃ TẠO"
            extra={
              <Button type="primary" onClick={() => this.setState({visible: true})}>
                Tạo nhắc nợ
              </Button>
            }
            style={{ height: "100vh" }}
          >
            <Table pagination={{ pageSize: 8 }} columns={columns} dataSource={this.state.data} indentSize={8} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="DANH SÁCH NỢ CẦN THANH TOÁN" style={{ height: "100vh" }}>
            <Table  pagination={{ pageSize: 8 }} columns={columns} dataSource={this.state.data2} />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="TẠO NHẮC NỢ"
            style={{ height: "auto", marginTop: "20vh" }}
          ></Card>
        </Col>
        <Modal
          title="Thông báo"
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
            // onValuesChange={onFormLayoutChange}
            // size={componentSize}
          >
            {/* <Form.Item label="Số tài khoản nợ">
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
              </Form.Item> */}

            <Form.Item label="Từ danh bạ">
              <Row>
                <Col xs={4} offset={0}>
                  <Switch
                  defaultChecked={this.state.isFromDanhba}
                  onChange={(value) =>
                    this.setState({ isFromDanhba: value })
                  }
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
              // onChange={(value) =>
              //   this.onChangesotaikhoan(value.target.value)
              // }
              />
            </Form.Item>

            {/* <Form.Item
                label="Chủ tài khoản"
                onChange={(value) =>
                  this.setState({ toAccountNumber: value.target.value })
                }
              >
                <Input disabled value={this.state.fullname} />
              </Form.Item> */}
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
            {/* <Form.Item label="Phí">
                <Select
                  defaultValue={this.state.fee}
                  onChange={(value) => this.setState({ fee: value })}
                >
                  <Select.Option value="nguoinhan">
                    Người nhận trả
                  </Select.Option>
                  <Select.Option value="nguoigui">Người gửi trả</Select.Option>
                </Select>
              </Form.Item> */}
          </Form>
        </Modal>
      </Row>
    );
  }
}
