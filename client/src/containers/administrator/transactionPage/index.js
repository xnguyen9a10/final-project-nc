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
import {
  DeleteOutlined,
  EditFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import store from "../../../redux/store/store";
const { Option } = Select;
const { confirm } = Modal;

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

class TransactionPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   data
    // }
  }
  async componentDidMount() {
    const result = await httpClient.get("/admin/transaction");
    console.log(result);
    // this.props.setData(result);
  }
  render() {
    return (
      <div>
        <div class="header" style={{}}>
          <h2 style={{display: "inline-block"}}>Lịch sử giao dịch</h2>
          <Select
            showSearch
            style={{ width: 200, float: "right" }}
            placeholder="Select a person"
            optionFilterProp="children"
            // onChange={onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="jack">RSA Bank</Option>
            <Option value="lucy">PGP Bank</Option>
            <Option value="tom">Tất cả</Option>
          </Select>
        </div>

        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default TransactionPage;
