import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setDataAction,
  openAlertAction,
  toggleModalNewEmployeeAction,
  setFormDataAction,
  toggleModalUpdateEmployeeAction,
} from "../../../redux/actions/TransactionPageAction";
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

const columns = [
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Tài khoản chuyển",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "address",
  },
  {
    title: "Tài khoản đích",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "Nội dung",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "Ngân hàng",
    dataIndex: "bank",
    key: "bank",
  },
];

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

class TransactionPage extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const result = await httpClient.get("/admin/transaction");
    console.log(result);
    store.dispatch(setDataAction(result.data))
    // this.props.setData(result);
  }
  render() {
    const {
      data,
      // isModalOpen,
      // isModalUpdateOpen,
      // toggleModalNewEmployee,
      // toggleModalUpdateEmployee,
    } = this.props;
    console.log(data)

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
            <Option value="rsa">RSA Bank</Option>
            <Option value="pgp">PGP Bank</Option>
            <Option value="all">Tất cả</Option>
          </Select>
        </div>

        <Table dataSource={data} columns={columns} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionPage);