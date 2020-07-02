import React, { useEffect, useRef } from "react";
import "../../App.less"
import { Layout } from "antd";
import "./App.css";
import { useForm } from "react-hook-form";
import { Card, Button, Form, Col, Alert } from 'react-bootstrap'
import { connect } from 'react-redux';
import { fetchCustomerAccount } from '../../redux/actions/CustomerActions';
import { Transfer } from '../../redux/actions/FundTransfer';
import { Typeahead } from 'react-bootstrap-typeahead';
import { RequestTransfer } from "../../redux/actions/RequestTransfer";
import { VerifyCode } from '../../redux/actions/VerifyCode';

function FundTransfer(props) {
    const isFirstRender = useRef(true);
    const { Content } = Layout;
    const { register, handleSubmit, errors } = useForm();
    
    const onSubmit = data => {
        console.log(data);
        const receiverAccountNumber = document.getElementById("receiverAccountNumber").value;
        if (receiverAccountNumber == "") {
            document.getElementById("alert").style.display = "block";
        }
        else {
            document.getElementById("alert").style.display = "none";
            data.receiverAccountNumber = receiverAccountNumber;
            document.getElementById("confirm").style.display = "block";
            props.sendRequest(data);
        }
    }

    const onVerify = () => {
        props.verifyCode(document.getElementById("code").value);
    }

    useEffect(()=>{
        if(isFirstRender.current==false){
            props.fundTransfer(props.requestResult.data);
        }
        else{
            isFirstRender.current =false;
        }
    }, [props.verifyResult.result])

    useEffect(() => {
        props.fetchCustomer();
    }, [])

    return (
        <Content style={{ margin: "24px 0px", width: "100%", fontFamily: "'Titillium Web', sans-serif", backgroundColor: "#eee" }}>
            <div style={{ width: "70%" }}>
                <Card style={{ width: "100%", backgroundColor: "white", marginLeft: "12px" }}>
                    <Card.Body>
                        <Card.Title style={{ fontWeight: "600", fontSize: "24px" }}>Fund Transfer</Card.Title>
                        <Card.Text style={{ opacity: "0.8", fontSize: "14px" }}>
                            We will send you a new password connected with your existing ibanking account.
                        </Card.Text>

                        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>From Account</Form.Label>
                                    <Form.Control name="accountHolderNumber" ref={register()} as="select" custom>
                                        <option>{
                                            props.customer.accounts.length >= 1 ? props.customer.accounts[0].account_id : ""
                                        } </option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>To Account</Form.Label>
                                    <Typeahead placeholder="Input account number or pick a name"
                                        id="typeahead"
                                        labelKey={(option) => `${option.name}`}
                                        renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
                                            <Form.Control id="receiverAccountNumber" value="" {...inputProps} ref={(input) => {
                                                inputRef(input);
                                                referenceElementRef(input);
                                            }}
                                            />
                                        )}
                                        onChange={(selected) => {
                                            document.getElementById("alert").style.display = "none";
                                        }}
                                        options={                         
                                            props.customer.customer?         
                                            props.customer.customer.receivers.map((receiver,index)=>
                                                <option key={receiver.account_id}>{receiver.nickname}</option>
                                            ):null                                
                                        }
                                    />
                                    <Alert id="alert" style={{ padding: "4px", fontSize: "13px", display: "none" }} variant="danger">This field is required</Alert>
                                </Form.Group>
                            </Form.Row>
                            <Form.Group>
                                <Form.Label >Amount</Form.Label>
                                <Form.Control type="number" name="transferAmount" ref={register({ required: true })} />
                                {errors.amount && <Alert style={{ padding: "4px", fontSize: "13px" }} variant="danger">This field is required</Alert>}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Content</Form.Label>
                                <Form.Control ref={register()} name="content" placeholder="Apartment, studio, or floor..." />
                            </Form.Group>

                            <Form.Group>
                                <Form.Check type='checkbox' name="isPayFee" ref={register()} label="I pay the transfer fee" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Transfer
                            </Button>

                        </Form>

                        <Form id="confirm" style={{ marginTop: "20px", display: "none" }} onSubmit={handleSubmit(onVerify)}>
                            <Alert variant='info' style={{ textAlign: "center" }}>
                                An email with a verification code was just sent to <span style={{ fontStyle: "italic", fontWeight: "bold" }}>dinhngoc123@gmail.com</span>
                            </Alert>
                            <Form.Group>
                                <Form.Control id="code" name="code" placeholder="Verification code..." />
                                {errors.code && <Alert style={{ padding: "4px", fontSize: "13px" }} variant="danger">This field is required</Alert>}
                                {props.verifyResult.error != null ?
                                    <Alert variant='danger'>{props.verifyResult.error.message}</Alert>
                                    : ""
                                }
                            </Form.Group>
                            <Button variant="danger" type="submit">
                                Confirm
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Content>
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
        verifyCode: (code) => dispatch(VerifyCode(code))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FundTransfer);