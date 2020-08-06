import React, { useEffect, useRef, useState } from "react";
import "../../App.less"
import { Layout } from "antd";
import "./App.css";
import { useForm } from "react-hook-form";
import { connect } from 'react-redux';
//import actions
import { fetchCustomerAccount } from '../../redux/actions/CustomerActions';
import { Transfer } from '../../redux/actions/FundTransfer';
import { RequestTransfer } from "../../redux/actions/RequestTransfer";
import { VerifyCode } from '../../redux/actions/VerifyCode';
import {SaveReceiver} from '../../redux/actions/SaveReceiver';
// import react boostrap
import { Card, Button, Form, Col, Alert, Modal } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead';
import { forEach } from "lodash";
function FundTransfer(props) {
    const isFirstRender = useRef(true);
    const isTransferSuccess = useRef(true);
    const { Content } = Layout;
    const { register, handleSubmit, errors } = useForm();
    //use for modal show up. 
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false);setShowAddReceiver(false);}
    const [successCard, setSuccessCard] = useState(false);
    const [errorCard, setErrorCard] = useState(false);
    const [stateCard, setStateCard] = useState(true);
    const [ notiText, setNotiText] = useState(""); 
    const [showAddReceiver, setShowAddReceiver] = useState(false);
    const [alreadyIn, setAlreadyIn] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [n, setN] = useState({});
    const onSubmit = data => {
        console.log(data);
        let receiverAccountNumber = document.getElementById("receiverAccountNumber").value;
        if (receiverAccountNumber == "") {
            document.getElementById("alert").style.display = "block";
        }
        else {
            document.getElementById("alert").style.display = "none";

            let flag = false;
            props.customer.customer.receivers.forEach(element => {     
                console.log(element)       
                if(element.nickname == receiverAccountNumber || element.account_id ==receiverAccountNumber){
                    flag=true;
                    receiverAccountNumber = element.account_id;
                    console.log(receiverAccountNumber);
                    setAlreadyIn(true);                   
                }
            });
            if(flag==false){
                setAlreadyIn(false);
            }
            data.receiverAccountNumber = receiverAccountNumber;     
            setN(receiverAccountNumber);
            console.log(data)       
            props.sendRequest(data);
        }
    }

    const onVerify = () => {
       // props.verifyCode(document.getElementById("code").value,document.getElementById("receiverAccountNumber").value,document.getElementById("transferAmount").value);
        props.verifyCode(document.getElementById("code").value, n,document.getElementById("transferAmount").value);

    }

    useEffect(() => {
        if (isFirstRender.current == false) {
            props.fundTransfer(props.requestResult.data);
            document.getElementById("confirm").style.display = "none";
            document.getElementById("confirm").reset();
            document.getElementById("info").reset();
            document.getElementById("receiverAccountNumber").value = "";
        }
        else {
            isFirstRender.current = false;
        }
    }, [props.verifyResult.result])

    useEffect(() => {
        if(props.verifyResult.error!==null){
            setErrorCard(true);
            setNotiText(props.verifyResult.error.message);
            return
        }
        else
        if (props.customerTransfer.result == true) {
            setSuccessCard(true);
            setNotiText("Transfer Successfully!")
            if(alreadyIn==false){
                setShow(true);
            }
            return
        }
        // if (props.customerTransfer.result == false) {
        //     setErrorCard(true);
        //     setNotiText(props.customerTransfer.error.message);
        // }
    }, [props.customerTransfer.result])

    useEffect(()=>{
        if(props.requestResult.result==false){
            setErrorCard(true);
            setNotiText(props.requestResult.error.message);
            document.getElementById("confirm").style.display = "none";
            setNotiText(props.requestResult.error);
        }
        if(props.requestResult.result==true){
            document.getElementById("confirm").style.display = "block";
            setSuccessCard(true);
            setNotiText("Send request successfully!");
        }
    },[props.requestResult.result])

    useEffect(()=>{
        if (props.customerTransfer.save != null){
            if(props.customerTransfer.save.status == "successful"){
                setAlreadyIn(false);
                setSuccessCard(true);
                setNotiText("Save receiver sucessfully!");
                handleClose();
                var obj = {
                    nickname: props.customerTransfer.save.data.nickname,
                    account_id: props.customerTransfer.save.data.account_id
                }
                console.log(obj);
                setReceiver(obj)
                props.customer.customer.receivers.push(obj);
            }
            if(props.customerTransfer.save.status=="failed"){
                setAlreadyIn(false);
                setErrorCard(true);
                setNotiText("Save receiver fail!");
                handleClose();
            }
        }     
        setAlreadyIn(false);
    },[props.customerTransfer.save])

    useEffect(() => {
        props.fetchCustomer();
    }, [])

    var stateCardProps = {
        display: "block"
    };

    if (stateCard == false) {
        stateCardProps.display = "none";
    }else{
        stateCardProps.display = "relative";
    }

    var errorCardProps = {
        display: "none"
    };

    if (errorCard == true) {
        errorCardProps.display = "block";
    }else{
        errorCardProps.display = "none";
    }

    var successCardProps = {
        display: "none"
    };

    if (successCard == true) {
        successCardProps.display = "block";
    }else{
        successCardProps.display = "none";
    }

    useEffect(() => {
        if (successCard == true) {
            setErrorCard(false);
            setStateCard(false);
        }
    }, [successCard])

    useEffect(() => {
        if (errorCard == true) {
            setStateCard(false);
            setSuccessCard(false);
        }
    }, [errorCard])

    useEffect(() => {
        if (stateCard == true) {
            setErrorCard(false);
            setSuccessCard(false);
        }
    }, [stateCard])

    const handleSave = ()=> {
        var name = document.getElementById("name").value;
        if (name==""){
            name = props.requestResult.data.receiverAccountNumber;
        }
        var object = {
            nickname: name,// Là tên đã lưu || tên sai(dạng số sai hoặc tên sai) || số tài khoản đúng. 
            account_id: props.requestResult.data.receiverAccountNumber
        }
        props.saveReceiver(object);
    }
    const handleAgree = () =>{
        setShowAddReceiver(true);
    }
    return (
        <>
            <Content style={{ margin: "24px 0px", width: "100%", fontFamily: "'Titillium Web', sans-serif", backgroundColor: "#eee" }}>
                <div style={{ width: "70%", paddingRight: "20px", float: "left" }}>
                    <Card style={{ width: "100%", backgroundColor: "white", marginLeft: "12px" }}>
                        <Card.Body>
                            <Card.Title style={{ fontWeight: "600", fontSize: "24px" }}>Chuyển tiền trong ngân hàng</Card.Title>
                            <Card.Text style={{ opacity: "0.8", fontSize: "14px" }}>
                                Dịch vụ chuyển tiền trong nội bộ, nhận tiền 24h
                        </Card.Text>

                            {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
                            <Form id="info" onSubmit={handleSubmit(onSubmit)}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Từ tài khoản nguồn</Form.Label>
                                        <Form.Control name="accountHolderNumber" ref={register()} as="select" custom>
                                            <option>{
                                                props.customer.accounts.length >= 1 ? props.customer.accounts[0].account_id : ""
                                            } </option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Người nhận</Form.Label>
                                        <Typeahead placeholder="Điền số tài khoản hoặc tên người nhận"
                                            id="typeahead"
                                            labelKey={(option) => `${option.nickname}`}
                                            renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
                                                <Form.Control id="receiverAccountNumber" value="" {...inputProps} ref={(input) => {
                                                    inputRef(input);
                                                    referenceElementRef(input);
                                                }}
                                                />
                                            )}
                                            onChange={(selected) => {
                                                document.getElementById("alert").style.display = "none";
                                                console.log(selected);                                               
                                                console.log(document.getElementById("receiverAccountNumber").value)
                                            }}
                                            options={
                                                props.customer.customer ?
                                                    props.customer.customer.receivers.map((obj) =>                                                          
                                                        {
                                                            var rObj = {};
                                                            rObj.key = obj.account_id;
                                                            rObj.nickname = obj.nickname;
                                                            return rObj;
                                                        }
                                                    ) : []
                                            }
                                        />
                                        <Alert id="alert" style={{ padding: "4px", fontSize: "13px", display: "none" }} variant="danger">This field is required</Alert>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group>
                                    <Form.Label >Số tiền</Form.Label>
                                    <Form.Control type="number" id="transferAmount" name="transferAmount" ref={register({ required: true })} />
                                    {errors.transferAmount && <Alert style={{ padding: "4px", fontSize: "13px" }} variant="danger">Không được để trống</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Nội dung(không bắt buộc)</Form.Label>
                                    <Form.Control ref={register()} name="content" placeholder="Apartment, studio, or floor..." />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Check type='checkbox' name="isPayFee" ref={register()} label="Tôi trả phí" />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Xác nhận
                            </Button>

                            </Form>

                            <Form id="confirm" style={{ marginTop: "20px", display: "none" }} onSubmit={handleSubmit(onVerify)}>
                                <Alert variant='info' style={{ textAlign: "center" }}>
                                        Mã xác thực đã được gửi đến email của bạn <span style={{ fontStyle: "italic", fontWeight: "bold" }}>.Hãy kiếmr tra</span>
                                </Alert>
                                <Form.Group>
                                    <Form.Control id="code" name="code" placeholder="Verification code..." />
                                    {errors.code && <Alert style={{ padding: "4px", fontSize: "13px" }} variant="danger">Không được để trống</Alert>}
                                </Form.Group>
                                <Button variant="danger" type="submit">
                                    Confirm
                            </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
                <div style={{ width: "30%", paddingRight: "20px", paddingLeft: "10px", float: "left" }}>
                    <Card className="card-noti" bg="info" style={stateCardProps} >
                        <Card.Header style={{ textAlign: "center", color: "white", fontSize: "20px" }}>
                            <i className="fas fa-smile"></i> Tình trạng tốt!</Card.Header>
                        <Card.Body style={{ backgroundColor: "white" }}>
                            <Card.Text>
                                Không có thông báo nào. <br />
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: "white" }}>
                            <Card.Text variant="info">Thống kê thanh toán ngày hôm nay</Card.Text>
                            <Col style={{ float: "left", width: "50%" }}>
                                <div style={{ fontWeight: "bold", fontSize: "22px" }}>00</div>
                                <Card.Text style={{ fontSize: "10px", opacity: "0.7" }}>Số giao dịch thực hiện</Card.Text>
                            </Col>
                            <Col style={{ float: "left", width: "50%" }}>
                                <div style={{ fontWeight: "bold", fontSize: "22px" }}>000000</div>
                                <Card.Text style={{ fontSize: "10px", opacity: "0.7" }}>Tổng số tiền</Card.Text>
                            </Col>
                        </Card.Footer>
                    </Card>

                    <Card bg="danger" className="card-noti" style={errorCardProps} >
                        <Card.Header style={{ textAlign: "center", color: "white", fontSize: "20px" }}><i className="fas fa-info-circle"></i> Lỗi!</Card.Header>
                        <Card.Body style={{ backgroundColor: "white" }}>
                            <Card.Text>{notiText}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card bg="success" className="card-noti" style={successCardProps}>
                        <Card.Header style={{ textAlign: "center", color: "white", fontSize: "20px" }}><i className="fas fa-check-circle"></i> Thành công!</Card.Header>
                        <Card.Body style={{ backgroundColor: "white" }}>
                            <Card.Text>{notiText}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Content>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Body>Bạn có muốn lưu người này lại cho lần giao dịch kế tiếp?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Có
                    </Button>
                    <Button variant="primary" onClick={handleAgree}>
                        Không
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddReceiver} onHide={handleClose} animation={false}>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tên</Form.Label>
                            
                            <Form.Control type="text" id="name" defaultValue="" name="name" placeholder="">                               
                            </Form.Control>
                            <div style={{opacity:"0.7", fontSize: "13px"}}>
                            Tên này sẽ được hiển thị trong danh sách tài khoản của người nhận trong thời gian tới. <br/>
                               
Để trống phần này nếu bạn muốn sử dụng tên mặc định trong tài khoản của người nhận
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        customer: state.customer,
        customerTransfer: state.customerTransfer,
        requestResult: state.customerRequestTransfer,
        verifyResult: state.verifyResult
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCustomer: () => dispatch(fetchCustomerAccount()),
        fundTransfer: (data) => dispatch(Transfer(data)),
        sendRequest: (data) => dispatch(RequestTransfer(data)),
        verifyCode: (code,receiverAccountNumber,amount) => dispatch(VerifyCode(code,receiverAccountNumber,amount)),
        saveReceiver: (data) => dispatch(SaveReceiver(data)) 
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FundTransfer);