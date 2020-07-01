import React, { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Layout } from "antd";
import { connect } from 'react-redux';
import { fetchCustomerAccount } from '../../redux/actions/CustomerActions';
import { getUserName } from '../../utils/auth';

function Profile({ customers, fetchProfile }) {
    const { Content } = Layout;
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile])
    console.log(localStorage);


    function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-" : "";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
      
          return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {}
    };

    return (
        <div>
            <Content style={{ margin: "24px 0px" }}>
                <div className="site-layout-background" style={{ padding: 24, height: "600px" }}>
                    <div id="sub_content">
                        <div style={{ width: "100%" }}>
                            {
                                customers.accounts.map((account, index) =>
                                    <div style={{ width: "33%", paddingRight: "12px", float:"left", fontFamily: "'Titillium Web', sans-serif" }}>
                                        <Card key={index} style={{ width: '100%' }}>
                                            <Card.Body>
                                                <Card.Title style={{ fontWeight: "600" }}> {account.account_id} </Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "13px" }}>ACCOUNT NUMBER</Card.Subtitle>
                                                <Card.Text style={{ opacity: "0.8", fontSize: "12px", marginTop: "20px" }}>
                                                    <div>
                                                        <i className="fa fa-user"></i>
                                                        <span style={{ marginLeft: "8px" }}> LÊ ĐÌNH NGỌC </span>
                                                    </div>
                                                    <div>
                                                        <i className="fas fa-gift"></i>
                                                        <span style={{ marginLeft: "8px" }} > 
                                                        {index==0? "PAYMENT ACCOUNT": "SAVING ACCOUNT"}
                                                        </span>
                                                    </div>
                                                </Card.Text>
                                                <Card.Text>
                                                    <div style={{fontFamily:"'Titillium Web', sans-serif", fontSize:"14px"}}>
                                                        <span style={{fontWeight:"600", paddingRight:"8px"}}>Available Balance:</span> {formatMoney(account.balance)} VND
                                                        <div>
                                                        <span style={{fontWeight:"600", paddingRight:"8px"}}>Brand:</span> South VietNam
                                                        </div>
                                                    </div>
                                                    
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer className="text-muted">
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        <Button size="sm" variant="outline-secondary">VIEW</Button>
                                                    </div>
                                                    <div>
                                                        <Button size="sm" variant="outline-secondary" >STATEMENT</Button>
                                                    </div>
                                                    <div>
                                                        <Button size="sm" variant="outline-secondary" >FUND TRANSFER</Button>
                                                    </div>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        customers: state.customer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: () => dispatch(fetchCustomerAccount())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);