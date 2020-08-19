import React, { useEffect, useRef, useState } from "react";
import "../../App.less"
import { Layout } from "antd";
import "./App.css";
import httpClient from '../../utils/httpClient';
import Moment from 'react-moment';
//import actions

// import react boostrap
import { Card, Button, Form, Col, Alert, Modal, Table } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead';
import { forEach } from "lodash";
function TransactionHistory(props) {
  const { Content } = Layout;
  const [type, setType] = useState(0);
  const [transferHis, setTransferHis] = useState({});
  const [receiveHis, setReceiveHis] = useState({});
  const [payHis, setPayHis] = useState({});

  const onTypeChanged = (param) => {
    if (param.target.value == 1) {
      setType(1)
    }
    if (param.target.value == 2) {
      setType(2)
    }
    if (param.target.value==3){
      setType(3)
    }
  }

  const onCheckChanged = async(param) => {
    if (param.target.checked){
      let transferdata = await httpClient.get(`/customer/transfer-history/restrict`);
      setTransferHis(transferdata.data);

      let receiverdata = await httpClient.get(`/customer/receive-history/restrict`);
      setReceiveHis(receiverdata.data);

      let paydata = await httpClient.get(`/customer/payment-history/restrict`); 
      setPayHis(paydata.data);
    }
    else{
      let transferdata = await httpClient.get(`/customer/transfer-history/`);
      setTransferHis(transferdata.data);

      let receiverdata = await httpClient.get(`/customer/receive-history/`);
      setReceiveHis(receiverdata.data);

      let paydata = await httpClient.get(`/customer/payment-history/`); 
      setPayHis(paydata.data);
    }
  }

  useEffect( async() => {
    let transferdata = await httpClient.get(`/customer/transfer-history/`);
    setTransferHis(transferdata.data);
    console.log(transferdata)

    let receiverdata = await httpClient.get(`/customer/receive-history/`);
    setReceiveHis(receiverdata.data);

    let paydata = await httpClient.get(`/customer/payment-history/`); 
    setPayHis(paydata.data);
  }, [])

  return (
    <>
      <Content style={{ margin: "24px 0px", width: "100%", fontFamily: "'Titillium Web', sans-serif", backgroundColor: "#eee" }}>
        <div className="site-layout-background" style={{ width: "100%", paddingRight: "20px", float: "left" }}>
          <Card style={{ width: "100%", backgroundColor: "white", marginLeft: "12px" }}>
            <Card.Body>
              <Card.Title style={{ fontWeight: "600", fontSize: "24px" }}>LỊCH SỬ GIAO DỊCH</Card.Title>

              <div style={{ width: "250px", marginBottom: "24px" }}>
                <Form.Control name="type" as="select" className="mr-sm-2" custom onChange={onTypeChanged.bind(this)}>
                  <option value="0" disabled="true" selected="true">--Loại giao dịch--</option>
                  <option value="1">Thanh toán</option>
                  <option value="2">Nhận tiền</option>
                  <option value="3">Thanh toán nhắc nợ</option>
                </Form.Control>
              </div>
              <div style={{ width: "250px", marginBottom: "24px" }}>
                <Form.Group onChange={onCheckChanged.bind(this)}>
                  <Form.Check type="checkbox" label="Xem lịch sử 30 ngày gần đây" />
                </Form.Group>
              </div>

              {type != 0 ?
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ngày</th>
                      <th>Loại ngân hàng</th>
                      {type == 1 ?<th>Tài khoản người nhận</th> : ""}
                      {type == 3 ? <th>Tài khoản người nhận</th> : ""}
                      {type == 2 ? <th>Tài khoản người gửi</th> : ""}
                      <th>Số tiền</th>
                      <th>Nội dung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {type == 1 ? transferHis.map((obj, idx) =>

                      <tr key={obj._id}>
                        <td>{idx + 1}</td>
                        <td><Moment format="hh:mm DD/MM/YYYY">{obj.transferAt}</Moment></td>
                        <td>{obj.isOutside? "Ngoài hệ thống": "Trong hệ thống"}</td>
                        <td>{obj.receiverAccountNumber}</td>
                        <td>{obj.transferAmount}</td>
                        <td>{obj.content}</td>
                      </tr>) : ""
                    }
                    {
                      type == 2 ? receiveHis.map((obj, idx) =>

                        <tr key={obj._id}>
                          <td>{idx + 1}</td>
                          <td><Moment format="hh:mm DD/MM/YYYY">{obj.transferAt}</Moment></td>
                          <td>{obj.isOutside? "Ngoài hệ thống": "Trong hệ thống"}</td>
                          <td>{obj.accountHolderNumber}</td>
                          <td>{obj.transferAmount}</td>
                          <td>{obj.content}</td>
                        </tr>) : ""
                    }
                    {
                      type == 3 ? payHis.map((obj, idx) =>
                        <tr key={obj._id}>
                          <td>{idx + 1}</td>
                          <td><Moment format="hh:mm DD/MM/YYYY">{obj.transferAt}</Moment></td>
                          <td>{obj.isOutside? "Ngoài hệ thống": "Trong hệ thống"}</td>
                          <td>{obj.accountHolderNumber}</td>
                          <td>{obj.transferAmount}</td>
                          <td>{obj.content}</td>
                        </tr>) : ""
                    }
                  </tbody>
                </Table>:""
              }

            </Card.Body>
          </Card>
        </div>
      </Content>
    </>
  )
}
export default TransactionHistory;
