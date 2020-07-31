import React from "react";
import { Form, Input, Button, Checkbox, Table } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';
import { Link } from "react-router-dom";
import { Tabs, Radio, Modal } from 'antd';
import { Plus } from "@ant-design/icons"

const { TabPane } = Tabs;

class receiversManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "large",
      insideReceivers: {},
      visible: false,
    }
  }

  async componentDidMount() {
    const insideReceiversList = await httpClient.get(`/customer/get-inside-receiver`);

    this.setState({
      insideReceivers: insideReceiversList,
    })
  }

  openReceiverModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.onFinish()
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancelUpdate=e=>{
    this.setState({
      update:false
    })
  }

  async success(data) {
    Modal.success({
      title:"Thành công",  
      content: data,
    });
    const insideReceiversList = await httpClient.get(`/customer/get-inside-receiver`);

    this.setState({
      insideReceivers: insideReceiversList,
    })
  }

  async error(message){
    Modal.error({
        title: 'Thất bại',
        content: message,
      });
      const insideReceiversList = await httpClient.get(`/customer/get-inside-receiver`);

      this.setState({
        insideReceivers: insideReceiversList,
      })
  }

  onFinish = async (values) => {
    const result = await httpClient.post('/customer/set-receiver',values);
    if(result.status=="failed") this.error(result.err)
    else this.success(result.data)
    this.setState({
      visible: false,
    });
  };

  onDelete=async (account_id)=>{
    const result = await httpClient.post(`/customer/delete-receiver/${account_id}`);
    if(result.status=="failed") this.error(result.err)
    else this.success(result.data)
  }

  createInsideReceiverTable() {
    const { insideReceivers } = this.state
    console.log(insideReceivers)
    const dataSource = []
    for (let i = 0; i < insideReceivers.length; i++) {
      var data = {
        key: i + 1,
        AccountNumber: insideReceivers[i].account_id,
        Nickname: insideReceivers[i].nickname
      }
      dataSource.push(data)
    }
    const columns = [
      {
        title: 'STT',
        dataIndex: 'key',
        key: 'stt',
      },
      {
        title: 'Tên gợi nhớ',
        dataIndex: 'Nickname',
        key: 'Nickname',
      },
      {
        title: 'Số tài khoản người nhận',
        dataIndex: 'AccountNumber',
        key: 'AccountNumber',
      },
      {
        title: 'Hành động',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
          <Button style={{color:"blue"}}
            onClick={(e) => { this.onDelete(record.AccountNumber); }}
          >
            Xóa
          </Button>
          </div>
        ),
      },
    ];
    return { dataSource, columns }
  }


  render() {
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    const { size } = this.state;
    const insideReceiverTable = this.createInsideReceiverTable()
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size={size}>
          <TabPane tab="Người nhận nội bộ" key="1">
            <Button type="primary" size="large" onClick={this.openReceiverModal}>Thêm mới</Button>
            <Table dataSource={insideReceiverTable.dataSource} columns={insideReceiverTable.columns}></Table>
          </TabPane>
          <TabPane tab="Người nhận ngoài ngân hàng" key="2">
            <Button type="primary" size="large" onClick={this.openReceiverModal}>Thêm mới</Button>
            <Table dataSource={insideReceiverTable.dataSource} columns={insideReceiverTable.columns}></Table>
          </TabPane>
        </Tabs>
        <Modal
          title="Thêm người nhận"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form
            onFinish={this.onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="receiver_accountNumber"
              rules={
                [
                  {
                    required: true,
                    message: "Vui lòng nhập số tài khoản",
                  }
                ]
              }
            >
              <Input type="text" placeholder="Nhập số tài khoản" />
            </Form.Item>

            <Form.Item
              name="receiver_nickname"
            >
              <Input type="text" placeholder="Nhập tên gợi nhớ" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Thêm người nhận
                     </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default receiversManagement;