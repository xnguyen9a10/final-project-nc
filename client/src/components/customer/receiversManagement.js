import React from "react";
import { Form, Input, Button, Checkbox, Table, Select } from "antd";
import axios from "axios";
import httpClient from '../../utils/httpClient';
import { Link } from "react-router-dom";
import { Tabs, Radio,Modal } from 'antd';
import { Plus } from "@ant-design/icons"
const { TabPane } = Tabs;


class receiversManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "large",
      insideReceivers: {},
      outsideReceivers: {},
      visible: false,
      visibleOutside:false, 
      show:false,
      edit_account_id: "",
      insideReceiverTable: {},
      outsideReceiverTable: {}
    }
  }

  async componentDidMount() {
    const insideReceiversList = await httpClient.get(`/customer/get-inside-receiver`);
    const outsideReceiversList = await httpClient.get(`/customer/get-outside-receiver`);
    this.setState({
      insideReceivers: insideReceiversList,
      outsideReceivers: outsideReceiversList,
    })
    const insideReceiver = this.createInsideReceiverTable()
    const outsideReceiver = this.createOutsideReceiverTable()
    this.setState({
      insideReceiverTable: insideReceiver, 
      outsideReceiverTable: outsideReceiver,
    })
  }
  // Inside receiver
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

  handleCancelUpdate = e => {
    this.setState({
      update: false
    })
  }

  async success(data) {
    Modal.success({
      title: "Thành công",
      content: data,
    });
    const insideReceiversList = await httpClient.get(`/customer/get-inside-receiver`);

    this.setState({
      insideReceivers: insideReceiversList,
    })
  }

  async error(message) {
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
    const result = await httpClient.post('/customer/set-receiver', values);
    if (result.status == "failed") this.error(result.err)
    else this.success(result.data)
    this.setState({
      visible: false,
    });
  };

  onFinishEdit = async(values) =>{
    var obj = {
      "edit_account_id": this.state.edit_account_id,
      "nickname": values.receiver_nickname
    }
    console.log(obj);
    const result = await httpClient.post('/customer/edit-receiver', obj);
    if(result==true){
      const insideReceiversList = await httpClient.get(`/customer/get-inside-receiver`);
      this.setState({
        insideReceivers: insideReceiversList,
        show: false,
      })
      
      this.setState({
        insideReceivers: insideReceiversList,
      })
      const insideReceiver = this.createInsideReceiverTable()
      const outsideReceiver = this.createOutsideReceiverTable()
      this.setState({
        insideReceiverTable: insideReceiver, 
        outsideReceiverTable: outsideReceiver,
      })
    }
  }
  

  onDelete = async (account_id) => {
    const result = await httpClient.post(`/customer/delete-receiver/${account_id}`);
    if (result.status == "failed") this.error(result.err)
    else this.success(result.data)
  }

  handleClose = _ => {
    this.setState({
      show: false,
    })
  }
  onEdit = (account_id, nickname) => {
    this.setState({
      show:true,    
      edit_account_id: account_id,
    })
  }

  createInsideReceiverTable() {
    const { insideReceivers } = this.state
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
            <Button variant="danger"
              onClick={(e) => { this.onDelete(record.AccountNumber); }}
            >
              Xóa
          </Button>
          <Button variant="primary" onClick={(e)=>{this.onEdit(record.AccountNumber, record.Nickname)}}>
              Sửa
          </Button>
          </div>
        ),
      },
    ];
    return { dataSource, columns }
  }
  //End of inside receiver
  //Outside Receiver

  openReceiverOutsideModal=()=>{
    this.setState({
      visibleOutside: true,
    });
  }

  handleCancelOutside = e => {
    this.setState({
      visibleOutside: false,
    });
  };

  onDeleteOutside = async (account_id) => {
    const result = await httpClient.post(`/customer/delete-outside-receiver/${account_id}`);
    if (result.status == "failed") this.error(result.err)
    else this.success(result.data)
    const outsideReceiversList = await httpClient.get(`/customer/get-outside-receiver`);
    this.setState({
      outsideReceivers:outsideReceiversList
    });
  }

  onFinishOutside = async (values) => {
    console.log(values)
    const result = await httpClient.post('/customer/set-outside-receiver', values);
    if (result.status == "failed") this.error(result.err)
    else this.success(result.data)
    const outsideReceiversList = await httpClient.get(`/customer/get-outside-receiver`);
    this.setState({
      visibleOutside: false,
      outsideReceivers:outsideReceiversList
    });
  };


  createOutsideReceiverTable() {
    const { outsideReceivers } = this.state
    const dataSource = []
    for (let i = 0; i < outsideReceivers.length; i++) {
      var data = {
        key: i + 1,
        AccountNumber: outsideReceivers[i].account_id,
        Nickname: outsideReceivers[i].nickname,
        From: outsideReceivers[i].from
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
        title: 'Loại ngân hàng',
        dataIndex: 'From',
        key: 'From',
      },
      {
        title: 'Hành động',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            <Button style={{ color: "blue" }}
              onClick={(e) => { this.onDeleteOutside(record.AccountNumber); }}
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
    /*const insideReceiverTable = this.createInsideReceiverTable()*/
    const outsideReceiverTable = this.createOutsideReceiverTable()
    const { Option } = Select;
    return (
    <div>
        <Tabs defaultActiveKey="1" type="card" size={size}>
          <TabPane tab="Người nhận nội bộ" key="1">
            <Button type="primary" size="large" onClick={this.openReceiverModal}>Thêm mới</Button>
            <Table dataSource={this.state.insideReceiverTable.dataSource} columns={this.state.insideReceiverTable.columns}></Table>
          </TabPane>
          <TabPane tab="Người nhận ngoài ngân hàng" key="2">
            <Button type="primary" size="large" onClick={this.openReceiverOutsideModal}>Thêm mới</Button>
            <Table dataSource={outsideReceiverTable.dataSource} columns={outsideReceiverTable.columns}></Table>
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
        <Modal
          title="Thêm người nhận ngoài ngân hàng"
          visible={this.state.visibleOutside}
          onCancel={this.handleCancelOutside}
          footer={null}
        >
          <Form
            onFinish={this.onFinishOutside}
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
              rules={
                [
                  {
                    required: true,
                    message: "Vui lòng nhập tên gợi nhớ",
                  }
                ]
              }
            >
              <Input type="text" placeholder="Nhập tên gợi nhớ" />
            </Form.Item>
            <Form.Item
            name="type"
            rules={
              [
                {
                  required: true,
                  message: "Vui lòng chọn loại ngân hàng",
                }
              ]
            }
            >
              <Select
                
                placeholder="Chọn loại ngân hàng">
                <Option value="pgp">pgp</Option>
                <Option value="rsa">rsa</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Thêm người nhận
                     </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Chỉnh sửa người nhận"
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
        <Modal
          title="Thêm người nhận ngoài ngân hàng"
          visible={this.state.visibleOutside}
          onCancel={this.handleCancelOutside}
          footer={null}
        >
          <Form
            onFinish={this.onFinishOutside}
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
              rules={
                [
                  {
                    required: true,
                    message: "Vui lòng nhập tên gợi nhớ",
                  }
                ]
              }
            >
              <Input type="text" placeholder="Nhập tên gợi nhớ" />
            </Form.Item>
            <Form.Item
            name="type"
            rules={
              [
                {
                  required: true,
                  message: "Vui lòng chọn loại ngân hàng",
                }
              ]
            }
            >
              <Select
                
                placeholder="Chọn loại ngân hàng">
                <Option value="pgp">pgp</Option>
                <Option value="rsa">rsa</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Thêm người nhận
                     </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Chỉnh sửa người nhận"
          visible={this.state.show}
          onCancel={this.handleClose}
          footer={null}
        >
          <Form
            onFinish={this.onFinishEdit}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="receiver_nickname"
            >
              <Input type="text" value={this.state.editname} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Cập nhật
                    </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default receiversManagement;