import React, { useEffect } from "react";
import "../../App.less"
import { Layout, Menu } from "antd";
import "./App.css";
//import httpClient from './utils/httpClient';
//import LoginComponent from './components/login/login';
import profile_icon from '../../images/profile.svg';
import pay_icon from '../../images/pay.svg';
import pay2_icon from '../../images/pay2.svg';
import saving_icon from '../../images/saving.svg';
import info_service_icon from '../../images/info_service.svg';
import transfer1_icon from '../../images/transfer1.svg';
import transfer2_icon from '../../images/transfer2.svg';

import info_icon from '../../images/info.svg';
import axios from 'axios';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    useParams,
} from 'react-router-dom'
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MoneyCollectOutlined,
    HistoryOutlined
} from "@ant-design/icons";
//import PrivateRoute from "./components/common/PrivateRoute";
//import ManagementPageComponent from "./containers/administrator/managementPage";

function App(props) {
    const { Header, Content, Footer, Sider } = Layout;

    function click() {
        document.getElementById("list").style.display = "none";
    }
    if (document.getElementById("list") != null) {
        if (document.getElementById("list").style.display == "none") {
            document.getElementById("list").style.display = "block";
        }
    }
    return (
        <Layout style={{ height: "100vh" }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
                    <Menu.Item key="1" icon={<UserOutlined style={{ marginTop: "-10px;" }} />}>
                        <Link to="/employee/create-customer">TRANG CHỦ</Link>
                    </Menu.Item>
                    <Menu.Item style={{ borderBottom: "0.1px solid lightgrey" }} key="2" icon={<MoneyCollectOutlined />}>
                        <Link to="/employee/recharge-account">DỊCH VỤ</Link>

                    </Menu.Item>
                    <Menu style={{}} theme="dark" mode="inline">
                        <Menu.Item key="1">
                            <Link to="/employee/recharge-account">Thông tin tài khoản</Link>
                        </Menu.Item>
                    </Menu>
                    <Menu.Item key="3" icon={<HistoryOutlined />}>
                        <Link to="/employee/transaction-history">LIÊN HỆ</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    className="site-layout-sub-header-background"
                    style={{ padding: 0 }}
                />
                <Content style={{ margin: "24px 0px" }}>
                    <div className="site-layout-background" style={{ padding: 24, height: "600px" }}>
                        <Router>
                            <ul id="list" style={{ display: 'block' }}>
                                <li style={{ display: 'inline-block', width: '25%', paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>
                                            <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={profile_icon} style={{ width: "100%" }} />
                                            </div>
                                            <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                                Thông tin tài khoản
                                                <br />
                                                <br />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', paddingLeft: "24px", paddingRight: "24px" }}>

                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>
                                            <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={pay_icon} style={{ width: "100%" }} />
                                            </div>
                                            <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                                Thanh toán
                                                <br />
                                                <br />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>

                                            <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={transfer1_icon} style={{ width: "100%" }} /><br />
                                            </div>
                                            <div style={{ paddingTop: "8px", width: "60%", margin: "auto", textAlign: "center", color: "#00008B" }}>
                                                Chuyển khoản trong hệ thống
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>

                                            <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={transfer2_icon} style={{ width: "100%" }} /><br />
                                            </div>
                                            <div style={{ paddingTop: "8px", width: "60%", margin: "auto", textAlign: "center", color: "#00008B" }}>
                                                Chuyển khoản ngoài hệ thống
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>
                        

                                                <div style={{ width: "90%", margin: "auto" }}>
                                                    
                                                <img src={info_service_icon} style={{ width: "100%" }} />
                                                </div>
                
                                            <div>
                                                <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                                    Thông tin dịch vụ
                                            </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>
                                           
                                                <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={saving_icon} style={{ width: "100%" }} /><br /></div>
                                      
                                            <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                                Tiền gửi trực tuyến
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>
                                        
                                                <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={pay2_icon} style={{ width: "100%" }} /><br /></div>
                                       
                                            <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                                Nộp thuế điện tử
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                                    <Link to="/profile" style={{ textDecoration: "none" }} onClick={click}>
                                        <div style={{ margin: "auto" }}>
                                         
                                                <div style={{ width: "90%", margin: "auto" }}>
                                                <img src={info_icon} style={{ width: "100%" }} /><br />
                                                </div>
                                         
                       
                                            <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                                Thông tin tín dụng
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>

                            <Switch>
                                <Route path="/profile" component={Profile} />
                                <Route exact path="/" />
                            </Switch>
                        </Router>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );


}
function Profile(props) {

    return (
        <div>
            <div className="row margin-bottom-32" style={{ marginBottom: '50px', paddingLeft: "20px" }}>
                <div className="medium-title row" style={{ marginLeft: "0px", fontSize: "20px" }}>Tài khoản lựa chọn</div>
                <br />
                <div style={{ display: "block" }}>
                    <select className="select-list">
                        <option>015324235</option>
                    </select>
                </div>

            </div>
            <div style={{ paddingBottom: "30px" }}>
                <div className="col-thrid left" style={{ height: '250px', borderRight: '0.1px solid lightgrey' }}>
                    <div className="margin-bottom-32">
                        <div className="medium-title ">Chủ tài khoản</div>
                        <div>LÊ ĐÌNH NGỌC</div>
                    </div>
                    <div className="margin-bottom-32">
                        <div className="medium-title ">Số tài khoản</div>
                        <div>0153242352131121</div>
                    </div>
                    <div className="bold" style={{ color: "#d12f37", marginTop: "20px;" }}>[Xem lịch sử giao dịch]</div>
                </div>
                <div className="col-thrid left" style={{ height: '250px', borderRight: '0.1px solid lightgrey' }}>
                    <div className="margin-bottom-32">
                        <div className="medium-title ">Chi nhánh</div>
                        <div>TP.HCM</div>
                    </div>
                    <div className="margin-bottom-32">
                        <div className="medium-title ">Trạng thái tài khoản</div>
                        <div>Họat động</div>
                    </div>
                </div>
                <div className="col-thrid left">
                    <div className="margin-bottom-32">
                        <div className="medium-title ">Loại tiền</div>
                        <div>VND</div>
                    </div>
                    <div className="margin-bottom-32">
                        <div className="medium-title ">Số dư tài khoản</div>
                        <div>9,250,000</div>
                    </div>
                </div>
            </div></div>

    )
}

function Service() {

}

export default App;