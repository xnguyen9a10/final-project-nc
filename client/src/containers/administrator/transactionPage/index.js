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
import moment from "moment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const { Option } = Select;
const { confirm } = Modal;

const columns = [
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
    render: (value) => moment.unix(value).format("MM/DD/YYYY"),
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
    dataIndex: "content",
    key: "content ",
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
    toggleModalUpdateEmployee: () =>
      dispatch(toggleModalUpdateEmployeeAction()),
    setFormData: (record) => dispatch(setFormDataAction(record)),
  };
};

class TransactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      rangeDate: "",
      select: "",
      total: 0,
      query: "",
    };
  }
  async componentDidMount() {
    const result = await httpClient.get("/admin/transaction");
    this.setState({total: result.data.money[0].sum})
    store.dispatch(setDataAction(result.data.data));
    // this.props.setData(result);
  }

  onChange = async (value) => {
    // const result = await httpClient.get("/admin/transactionquery/" + value);
    this.setState({ select: value });
  };

  fetchData = async () => {
    const params = {};
    params.fromDate = this.state.fromDate
    params.toDate = this.state.endDate;

    if (this.state.select !== "") {
      params.select = this.state.select;
    }
    const result = await httpClient.get("/admin/transactionquery", {
      params,
    });
    console.log(result)
    this.setState({total: result.data.money[0] && result.data.money[0].sum || 0})
    store.dispatch(setDataAction(result.data.data));
  };

  handleDatePickerChange = (date, dateString, id) => {
    this.setState({
      fromDate: dateString[0],
      toDate: dateString[1]
    })

 }

  render() {
    const { data } = this.props;
    return (
      <div>
        <div class="header" style={{}}>
          <h2 style={{}}>Lịch sử giao dịch</h2>
          <p>Tổng số tiền đã giao dịch: {this.state.total ? this.state.total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0}</p>
          <Select
            showSearch
            style={{ width: 200, float: "right", marginBottom: 10 }}
            placeholder="Chọn ngân hàng"
            optionFilterProp="children"
            onChange={this.onChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="rsa">RSA Bank</Option>
            <Option value="pgp">PGP Bank</Option>
            <Option value="all">Tất cả</Option>
          </Select>
          <RangePicker
            defaultValue={[moment(), moment()]}
            onChange={(dates, dateString) =>
              this.handleDatePickerChange(dates, dateString)
            }
            format={dateFormat}
          />
          <Button onClick={this.fetchData}>Get</Button>
        </div>

        <Table
          pagination={{ pageSize: 8 }}
          dataSource={data}
          columns={columns}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPage);
