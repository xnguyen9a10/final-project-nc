import React, { useEffect, useRef, useState } from "react";
import httpClient from '../../utils/httpClient';
import { Tabs, Radio, Layout } from 'antd';
// import react boostrap
import { Card, Button, Form, Modal, Table, Alert } from 'react-bootstrap';
import { useForm } from "react-hook-form";
const { TabPane } = Tabs;

function ReceiversManagement(props) {
  const {Content} = Layout;
  const { register, handleSubmit, errors } = useForm();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);
  const [errMess, setErrMess] = useState("");
  const [accEdited, setAccEdited] = useState("");
  const [typeEdited, setTypeEdited] = useState("");
  const [nameEdited, setNameEdited] = useState("");
  const [isOutside, setIsOutside] = useState(false);

  //data 
  const [receiversInsideList, setReceiversInsideList] = useState([])
  const [receiversOutsideList, setReceiversOutsideList] = useState([])

  //functions
  const openCreateModal = _ =>{
    setShowCreateModal(true);
  }
  const handleClose = _ => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setShowDeleteModal(false);
  }

  const onCreateReceiver = async(data) => {
    let result = null;
    if(isOutside==false){
      var obj = {
        receiver_nickname: data.new_nickname,
        receiver_accountNumber: data.new_account
      }
      result = await httpClient.post('/customer/set-receiver', obj);
    }
    else{
      var obj = {
        receiver_nickname: data.new_nickname,
        receiver_accountNumber: data.new_account,
        type: data.type,
      }
      result = await httpClient.post('/customer/set-outside-receiver', obj);
    }

    if (result.status == "failed") {
      setErrMess(result.err);
      setFailureModal(true);
    }
    else{
      setSuccessModal(true);
      let insideList = await httpClient.get(`/customer/get-inside-receiver`);
      let outsideList = await httpClient.get(`/customer/get-outside-receiver`);
      setReceiversInsideList(insideList);
      setReceiversOutsideList(outsideList);
    }
  }

  const onEditReceiver = (account_id, nickname,flag, type) => {
    if(flag==false){
      setIsOutside(false);
    }
    else{
      setIsOutside(true);
      setTypeEdited(type);
    }
    setAccEdited(account_id);
    setNameEdited(nickname);
    setShowUpdateModal(true);
  }

  const onUpdateReceiver = async(data) => {
    var obj = {
      "edit_account_id": accEdited, 
      "nickname": data.updated_nickname
    }
    let result = null;
    if(isOutside==false){
      result = await httpClient.post('/customer/edit-receiver', obj);
    }
    else{
      obj.from = data.type;
      result = await httpClient.post('/customer/edit-outside-receiver', obj);
    }
    if(result==true){
      let insideList = await httpClient.get(`/customer/get-inside-receiver`);
      let outsideList = await httpClient.get(`/customer/get-outside-receiver`);
  
      setReceiversInsideList(insideList);
      setReceiversOutsideList(outsideList);

      setSuccessModal(true);
    }
    else{
      setErrMess(result);
      setFailureModal(true);
    }
  }

  const onDeleteReceiverClick = (account_id, nickname, flag) => {
  
    if(flag == true){
      setIsOutside(true);
    }
    else {
      setIsOutside(false);
    }
    setAccEdited(account_id);
    setNameEdited(nickname);
    setShowDeleteModal(true);
  }

  const onDeleteReceiver = async() => {
    let result = null;
    if(isOutside==false){
      result = await httpClient.post(`/customer/delete-receiver/${accEdited}`);
    }
    else{ 
      result = await httpClient.post(`/customer/delete-outside-receiver/${accEdited}`);
    }
    
    if (result.status == "failed") {
      setErrMess(result.err);
      setFailureModal(true);
    }
    else {
      setSuccessModal(true);
      let insideList = await httpClient.get(`/customer/get-inside-receiver`);
      let outsideList = await httpClient.get(`/customer/get-outside-receiver`);
  
      setReceiversInsideList(insideList);
      setReceiversOutsideList(outsideList);
    }
  }

  const load_data = async() => {
    let insideList = await httpClient.get(`/customer/get-inside-receiver`);
    let outsideList = await httpClient.get(`/customer/get-outside-receiver`);

    setReceiversInsideList(insideList);
    setReceiversOutsideList(outsideList);
  }

  useEffect(() => {
   load_data()
  }, [])

  useEffect(() =>{
    if(successModal==true){
      setTimeout(function(){ setSuccessModal(false); setShowCreateModal(false); setShowUpdateModal(false); setShowDeleteModal(false) }, 2000);
    }
  },[successModal])
  useEffect(() =>{
    if(failureModal==true){
      setTimeout(function(){ setFailureModal(false) }, 2000);
    }
  },[failureModal])
  return(
    <>
      <Content style={{ width: "100%", fontFamily: "'Titillium Web', sans-serif", backgroundColor: "#eee" }}>
        <div className="site-layout-background" style={{ width: "100%", paddingRight: "20px", float: "left" }}>
          <Card style={{ width: "100%", backgroundColor: "white", marginLeft: "12px" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "24px", marginBottom:"24px" }}>QUẢN LÝ DANH SÁCH NGƯỜI NHẬN</Card.Title>
                <Tabs defaultActiveKey="1" type="card" size="large">
                  <TabPane tab="Người nhận nội bộ" key="1">
                    <Button style={{marginTop:"12px", marginBottom:"12px"}} variant="outline-success" onClick={()=> {openCreateModal(); setIsOutside(false)}}>Thêm mới</Button>

                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Tên gợi nhớ</th>
                          <th>Số tài khoản</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>   
                        {
                          receiversInsideList.map((obj, idx) => 
                          <tr key={obj._id}>
                            <td>{idx + 1}</td>
                            <td>{obj.nickname}</td>    
                            <td>{obj.account_id}</td>
                            <td>
                              <Button style={{marginRight:"12px"}} variant="outline-danger" size="sm" onClick={() => onDeleteReceiverClick(obj.account_id, obj.nickname, false)}><i class="fas fa-trash-alt"></i></Button>
                              <Button variant="outline-primary" size="sm" onClick={() => onEditReceiver(obj.account_id, obj.nickname, false)}><i class="fas fa-pencil-alt"></i></Button>
                            </td>                         
                          </tr>)
                        }                     
                      </tbody>
                    </Table>

                  </TabPane>
                  <TabPane tab="Người nhận ngoài ngân hàng" key="2">                    
                  <Button style={{marginTop:"12px", marginBottom:"12px"}} variant="outline-success" onClick={()=> {openCreateModal(); setIsOutside(true)}}>Thêm mới</Button>
                  <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Tên gợi nhớ</th>
                          <th>Số tài khoản</th>
                          <th>Loại ngân hàng</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>   
                        {
                          receiversOutsideList.map((obj, idx) => 
                          <tr key={obj._id}>
                            <td>{idx + 1}</td>
                            <td>{obj.nickname}</td>    
                            <td>{obj.account_id}</td>
                            <td>{obj.from}</td>
                            <td>
                              <Button style={{marginRight:"12px"}} variant="outline-danger" size="sm" onClick={() => onDeleteReceiverClick(obj.account_id, obj.nickname, true)}>
                                <i class="fas fa-trash-alt"></i>
                              </Button>
                              <Button variant="outline-primary" size="sm" onClick={() => onEditReceiver(obj.account_id, obj.nickname,true, obj.from)}><i class="fas fa-pencil-alt"></i></Button>
                            </td>                         
                          </tr>)
                        }                     
                      </tbody>
                    </Table>
                  </TabPane>
                </Tabs>
            </Card.Body>
          </Card>
        </div>
      </Content>

      <Modal show={showCreateModal} onHide={handleClose} animation={false}>
        <Form id="confirm"  onSubmit={handleSubmit(onCreateReceiver)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm người nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Số tài khoản</Form.Label>
              <Form.Control id="new_account" name="new_account" ref={register({ required: true })} />
              {errors.new_account && <Alert style={{ padding: "4px", fontSize: "13px" }} variant="danger">Không được để trống</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Tên gợi nhớ</Form.Label>
              <Form.Control id="new_nickname" name="new_nickname" ref={register()}/>
            </Form.Group>
            {
              isOutside? 
              <Form.Group>
                <Form.Label>Loại ngân hàng</Form.Label>                  
                <Form.Control name="type" as="select" ref={register()}>
                  <option value="pgp">PGP</option>
                  <option value="rsa">RSA</option>
                </Form.Control>
              </Form.Group>:""
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
          </Button>
            <Button variant="primary" type="submit">
              Thêm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleClose} animation={false}>
        <Form onSubmit={handleSubmit(onUpdateReceiver)}>
          <Modal.Header closeButton>
            <Modal.Title>Cập nhật người nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Sửa đổi tên gợi nhớ</Form.Label>
              <Form.Control id="updated_nickname" name="updated_nickname" ref={register()} defaultValue={nameEdited}/>
            </Form.Group>
            {
              isOutside?
              <Form.Group>
                <Form.Label>Loại ngân hàng</Form.Label>                  
                <Form.Control name="type" as="select" ref={register()}>
                  <option value="pgp"  selected={typeEdited=='pgp'} >PGP</option>
                  <option value="rsa" selected={typeEdited=='rsa'}>RSA</option>
                </Form.Control>
              </Form.Group>:""
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
          </Button>
            <Button variant="primary" type="submit">
              Cập nhật
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleClose} animation={false}>
        <Form  onSubmit={handleSubmit(onDeleteReceiver)}>
          <Modal.Header closeButton>
            <Modal.Title>Xóa người nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             Bạn có muốn xóa người nhận <span style={{fontWeight:"bold"}}>
               {nameEdited} - {accEdited}
             </span> ? 
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
          </Button>
            <Button variant="danger" type="submit">
              Xác nhận
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      <Modal show={successModal} onHide={handleClose} animation={true}>
          <Modal.Body style={{fontSize:"24px", textAlign:"center"}}>
            <i class="fas fa-check-circle" style={{color:"green"}}></i> Thành công
          </Modal.Body>
      </Modal>
      <Modal show={failureModal} size="sm" onHide={handleClose} animation={true}>
          <Modal.Body style={{fontSize:"24px", textAlign:"center"}}>
          <i class="fas fa-exclamation-circle" style={{color:"red"}}></i> Thất bại
                      <p style={{fontSize:"16px", textAlign:"center", marginTop:"8px"}}>{errMess}</p>
          </Modal.Body>
      </Modal>
    </>
  )
}

export default ReceiversManagement;