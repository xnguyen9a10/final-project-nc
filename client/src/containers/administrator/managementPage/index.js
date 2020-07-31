import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setDataAction,
  openAlertAction,
  toggleModalNewEmployeeAction,
  setFormDataAction,
  toggleModalUpdateEmployeeAction,
} from "../../../redux/actions/ManagementPageAction";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import httpClient from "../../../utils/httpClient";
import { extend } from "lodash";
import { DeleteOutlined, EditFilled, ExclamationCircleOutlined } from "@ant-design/icons";
import store from '../../../redux/store/store';
const { Option } = Select;
const { confirm } = Modal;

const mapStateToProps = (state) => {
  return state.ManagementPageReducer;
};
const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data) => dispatch(setDataAction(data)),
    openAlert: () => dispatch(openAlertAction()),
    toggleModalNewEmployee: () => dispatch(toggleModalNewEmployeeAction()),
    toggleModalUpdateEmployee: () => dispatch(toggleModalUpdateEmployeeAction()),
    setFormData: (record) => dispatch(setFormDataAction(record))
  };
};

const columns = [
  {
    title: "Mã",
    dataIndex: "code",
    key: "code",
    render: (text) => <a>{text && text.toUpperCase()}</a>,
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text && text.toUpperCase()}</a>,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Chức vụ",
    key: "role",
    dataIndex: "role",
    render: (role) => {
      let text;
      if (role === "giaodichvien") {
        text = "Giao dịch viên";
      }
      if (role === "nhanvien") {
        text = "Nhân viên";
      }
      if (role === "tindung") {
        text = "Tín dụng";
      }
      return <Tag color="blue">{text}</Tag>;
    },
  },
  {
    title: "Thao tác",
    key: "action",
    render: (text, record) => (
      <Space size="small">
        <Button
          type="text"
          icon={<EditFilled />}
          onClick={() => {
            console.log(record)
            store.dispatch(setFormDataAction(record));
            store.dispatch(toggleModalUpdateEmployeeAction());
          }}
        ></Button>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() =>
            confirm({
              title: "Bạn có chắc chắn muốn xóa nhân viên này?",
              icon: <ExclamationCircleOutlined />,
              content: "Thao tác này sẽ không thể phục hồi",
              okText: "Có",
              okType: "Cảnh báo",
              cancelText: "Không",
              onOk() {
                deleteEmployee(record);
              },
              onCancel() {
                console.log(record);
              },
            })
          }
        />
      </Space>
    ),
  },
];

const  createNewEmployee = async (data) => {
  const result = await httpClient.post('/admin/employee/create', data);
  refreshTable();
  store.dispatch(toggleModalNewEmployeeAction())
}

const deleteEmployee = async (data) => {
  const result = await httpClient.post('/admin/employee/delete', data);
  refreshTable();
}

const updateEmployee = async (data) => {
  const result = await httpClient.post('/admin/employee/update', data);
}

const refreshTable = async (data) => {
  const result = await httpClient.get("/admin/employee");
  store.dispatch(setDataAction(result))
}

class ManagementPage extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const result = await httpClient.get("/admin/employee");
    this.props.setData(result);
  }

  render() {
    const {
      data,
      isModalOpen,
      isModalUpdateOpen,
      toggleModalNewEmployee,
      toggleModalUpdateEmployee,
    } = this.props;
  
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    
    return (
      <div>
        <h2>Quản lý nhân viên</h2>
        <Button
          onClick={() => toggleModalNewEmployee()}
          type="primary"
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          + Thêm nhân viên
        </Button>
        <Modal
          okButtonProps={{
            form: "myform",
            key: "submit",
            htmlType: "submit",
          }}
          title="Tạo tài khoản nhân viên mới"
          visible={isModalOpen}
          // onOk={() => console.log(this.props.form)}
          // confirmLoading={confirmLoading}
          onCancel={() => toggleModalNewEmployee()}
        >
          <div>
            <Form
              id="myform"
              {...formItemLayout}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              initialValues={{
                prefix: "84",
              }} // onValuesChange={onFormLayoutChange}
              size={"small"}
              onFinish={(values) => createNewEmployee(values)}
            >
              <Form.Item
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
                name="name"
              >
                <Input />
              </Form.Item>

              <Form.Item name="code" label="Mã">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="phone" label="Điện thoại">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Chức vụ">
                <Select>
                  <Select.Option value="nhanvien">Nhân viên</Select.Option>
                  <Select.Option value="tindung">Tín dụng</Select.Option>
                  <Select.Option value="giaodichvien">
                    Giao dịch viên
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ" value="asdsadsad">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="username" label="Tài khoản">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="password" label="Mật khẩu">
                <Input type="password" placeholder="Password" />
              </Form.Item>
            </Form>
          </div>
          </Modal>
          <Modal
          okButtonProps={{
            form: "myupdateform",
            key: "submit",
            htmlType: "submit",
          }}
          title="Cập nhật thông tin"
          visible={isModalUpdateOpen}
          // onOk={() => console.log(this.props.form)}
          // confirmLoading={confirmLoading}
          onCancel={() => toggleModalUpdateEmployee()}
        >
          <div>
            <Form
              id="myupdateform"
              {...formItemLayout}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              initialValues={{...this.props.form, prefixSelector: 84}} // onValuesChange={onFormLayoutChange}
              size={"small"}
              onFinish={(values) => console.log(values._id)}
            >
              <Form.Item
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
                name="name"
              >
                <Input />
              </Form.Item>
              <Form.Item name="code" label="Mã">
                <Input style={{ width: "100%" }} disabled/>
              </Form.Item>


              <Form.Item name="phone" label="Điện thoại">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              
              <Form.Item label="Chức vụ" name="role" style={{ width: "100%" }}>
                <Select>
                  <Select.Option value="nhanvien">Nhân viên</Select.Option>
                  <Select.Option value="tindung">Tín dụng</Select.Option>
                  <Select.Option value="giaodichvien">
                    Giao dịch viên
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="username" label="Tài khoản">
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="password" label="Mật khẩu">
                <Input type="password" placeholder="Password" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Table columns={columns} dataSource={data} rowKey="_id"/>
      </div>
    );
  }
}

const ManagementPageComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagementPage);

export default ManagementPageComponent;
