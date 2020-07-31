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
import { Helmet } from "react-helmet";
import history from "../../utils/history";
import Profile from './Profile';
import { useForm } from "react-hook-form";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    useParams,
    HashRouter,
} from 'react-router-dom'
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MoneyCollectOutlined,
    HistoryOutlined,
    LoginOutlined
} from "@ant-design/icons";
import FundTransfer from './FundTransfer';
import ChangePassword from './ChangePassword'
import transactionHistory from "./transactionHistory";
import accountHistory from './accountHistory';
import outside from './outsideTranfer';
import Debs from './debs';

function App(props) {
    const { Header, Content, Sider } = Layout;

    return (
      <Router history={history}>
        <Layout style={{ height: "100vh" }}>
          <Sider
            id="sider"
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />

            <Menu
              id="menu"
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["4"]}
            >
              <Menu.Item
                key="1"
                icon={<UserOutlined style={{ marginTop: "-10px;" }} />}
              >
                <Link to="/">TRANG CHỦ</Link>
              </Menu.Item>
              <Menu.Item
                id="drop_menu"
                key="2"
                icon={<MoneyCollectOutlined />}
                onClick={() => {
                  document.getElementById("submenu").style.display = "block";
                  document.getElementById("sider").style.minWidth = "250px";
                  document.getElementById("sider").style.maxWidth = "250px";
                  if (document.getElementById("sub_content") != null) {
                    document.getElementById("sub_content").style.display =
                      "none";
                  }
                }}
              >
                <Link
                  to="/customer/services" /*onClick={(e)=>e.preventDefault()}*/
                >
                  DỊCH VỤ
                </Link>
              </Menu.Item>
              <Menu
                id="submenu"
                style={{
                  borderTop: "0.1px solid lightgrey",
                  borderBottom: "0.1px solid lightgrey",
                  display: "none",
                }}
                theme="dark"
                mode="inline"
              >
                <Menu.Item key="21">
                  <Link
                    to="/customer/profile"
                    style={{ paddingLeft: "20px" }}
                    onClick={(e) => {
                      var el = document.getElementById("menu");
                      for (var i = 0; i < el.length; i++) {
                        el[i].classList.remove("ant-menu-item-selected");
                      }
                      var el = document.getElementById("submenu");
                      for (var i = 0; i < el.length; i++) {
                        el[i].classList.remove("ant-menu-item-selected");
                      }
                      e.target.parentElement.classList.add(
                        "ant-menu-item-selected"
                      );
                    }}
                  >
                    Thông tin tài khoản
                  </Link>
                </Menu.Item>
                <Menu.Item key="22">
                  <Link
                    to="/customer/fund-transfer"
                    style={{ paddingLeft: "20px" }}
                  >
                    Thanh toán
                  </Link>
                </Menu.Item>
                <Menu.Item key="23">
                  <Link
                    to="/customer/change-password"
                    style={{ paddingLeft: "20px" }}
                  >
                    Đổi mật khẩu
                  </Link>
                </Menu.Item>
                <Menu.Item key="25" icon={<HistoryOutlined />}>
                  <Link to="/customer/transfer">
                    Chuyển khoản ngoài hệ thống
                  </Link>
                </Menu.Item>
                <Menu.Item key="26">
                  <Link to="/customer/debs" style={{ paddingLeft: "20px" }}>
                    Quản lý nhắc nợ
                  </Link>
                </Menu.Item>
                <Menu.Item key="24">
                  <Link
                    to="/customer/transaction-history"
                    style={{ paddingLeft: "20px" }}
                  >
                    Quản lý tài khoản
                  </Link>
                </Menu.Item>
              </Menu>
              <Menu.Item key="3" icon={<HistoryOutlined />}>
                <Link to="/employee/transaction-history">LIÊN HỆ</Link>
              </Menu.Item>
              <Menu.Item
                key="4"
                icon={<LoginOutlined />}
                onClick={() => {
                  localStorage.clear();
                  window.location.replace(`/login`);
                }}
              >
                Đăng xuất
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            {/* <Header className="site-layout-sub-header-background" style={{ backgroundColor: "#00008B" }}>
                        <div style={{ textAlign: "center", color: "white", fontSize: "28px" }}>
                            <span><img src={profile_icon} height="50px" style={{ paddingRight: "10px" }} /></span>
                    Thông tin tài khoản
                    </div>
                    </Header> */}
            <Switch>
              <Route
                path="/customer/services"
                render={(props) => <Service props />}
              ></Route>
              <Route path="/customer/profile">{<Profile props />}</Route>
              <Route path="/customer/fund-transfer" component={FundTransfer} />
              <Route
                path="/customer/change-password"
                component={ChangePassword}
              />
              <Route
                path="/customer/transaction-history"
                component={transactionHistory}
              />
              <Route
                path="/customer/accountHistory/:accountId"
                component={accountHistory}
              />
              <Route path="/customer/transfer" component={outside} />
              <Route path="/customer/debs" component={Debs} />
              <Route exact path="/customer" component={Home} />
            </Switch>
          </Layout>
        </Layout>
      </Router>
    );
}

function Service() {
    function click() {
        document.getElementById("list").style.display = "none";
    }
    if (document.getElementById("list") != null) {
        if (document.getElementById("list").style.display == "none") {
            document.getElementById("list").style.display = "block";
        }
    }
    return (
        <Router>
            <div className="site-layout-background" style={{ padding: 24, height: "600px" }}>
                {/* <ul id="list" style={{ display: 'block' }}>
                    <li style={{ display: 'inline-block', width: '25%', paddingLeft: "24px", paddingRight: "24px" }}>
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={() => {
                            document.getElementById("list").style.display = "none";

                        }
                        }>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={profile_icon} className="img-icon" style={{ width: "100%" }} />
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
                        <Link to="/customer/fund-transfer" style={{ textDecoration: "none" }} onClick={() => document.getElementById("list").style.display = "none"}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={pay_icon} className="img-icon" style={{ width: "100%" }} />
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
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={() => document.getElementById("list").style.display = "none"}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={transfer1_icon} className="img-icon" style={{ width: "100%" }} /><br />
                                </div>
                                <div style={{ paddingTop: "8px", width: "60%", margin: "auto", textAlign: "center", color: "#00008B" }}>
                                    Chuyển khoản trong hệ thống
                            </div>
                            </div>
                        </Link>
                    </li>

                    <li style={{ display: 'inline-block', width: '25%', paddingLeft: "24px", paddingRight: "24px" }}>
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={click}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={transfer2_icon} className="img-icon" style={{ width: "100%" }} /><br />
                                </div>
                                <div style={{ paddingTop: "8px", width: "60%", margin: "auto", textAlign: "center", color: "#00008B" }}>
                                    Chuyển khoản ngoài hệ thống
                            </div>
                            </div>
                        </Link>
                    </li>

                    <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={click}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={info_service_icon} className="img-icon" style={{ width: "100%" }} />
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
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={click}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={saving_icon} className="img-icon" style={{ width: "100%" }} /><br /></div>
                                <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                    Tiền gửi trực tuyến
                            </div>
                            </div>
                        </Link>
                    </li>

                    <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={click}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={pay2_icon} className="img-icon" style={{ width: "100%" }} /></div>
                                <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                    Nộp thuế điện tử
                            </div>
                            </div>
                        </Link>
                    </li>
                    <li style={{ display: 'inline-block', width: '25%', marginTop: "20px", paddingLeft: "24px", paddingRight: "24px" }}>
                        <Link to="/customer/profile" style={{ textDecoration: "none" }} onClick={click}>
                            <div style={{ margin: "auto" }}>
                                <div style={{ width: "90%", margin: "auto" }}>
                                    <img src={info_icon} className="img-icon" style={{ width: "100%" }} /><br />
                                </div>
                                <div style={{ paddingTop: "8px", textAlign: "center", color: "#00008B" }}>
                                    Thông tin tín dụng
                            </div>
                            </div>
                        </Link>
                    </li>
                </ul> */}

                <Switch>
                    <Route path="/customer/profile" component={Profile} />
                    <Route path="/customer/fund-transfer" component={FundTransfer} />
                    <Route path="/customer/change-password" component={ChangePassword} />
                    <Route exact path="/customer" component={Service} />
                </Switch>

            </div>
        </Router>
    )
}


function Home(props) {
    return (
        <div>This is Home</div>
    )
}

export default App;