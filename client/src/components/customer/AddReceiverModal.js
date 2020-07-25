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
    
    return (
        <> 
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Body>Do you want to save this receiver for the next transfer?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FundTransfer);