import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setDataAction,
  openAlertAction
} from './actions';
import { Table, Tag, Space } from 'antd';
import httpClient from '../../../utils/httpClient';
import { extend } from 'lodash';

const mapStateToProps = (state) => {
  return state.managementPageReducer;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data) => dispatch(setDataAction(data)),
    openAlert: () => dispatch(openAlertAction())
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'user_id',
    key: 'user_id',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: '_id',
    key: '_id',
  },
  // {
  //   title: 'Address',
  //   dataIndex: 'address',
  //   key: 'u',
  // },
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
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data2 = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

class ManagementPage extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount () {
    const result = await httpClient.get("/admin/employee");
    this.props.setData(result)
  }

  render () {
    const {
      data
    } = this.props;
    console.log(data)

    return ( 
    <Table columns={columns} dataSource={data} />
    )
  }
}

const ManagementPageComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagementPage);

export default ManagementPageComponent;