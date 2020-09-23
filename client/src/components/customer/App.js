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
import TransactionHistory from "./transactionHistory";
import outside from './outsideTranfer';
import Debs from './debs';
import ReceiversManagement from "./receiversManagement"
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
            defaultSelectedKeys={["1"]}
          >
            <Menu.Item
              key="1"
              icon={<UserOutlined style={{ marginTop: "10px;" }} />}
            >
              <Link to="/customer/profile">Trang chủ</Link>
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
                to="#" /*onClick={(e)=>e.preventDefault()}*/
              >
                Dịch vụ
                </Link>
            </Menu.Item>
            <Menu
              id="submenu"
              defaultSelectedKeys={['21']}
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
                <Link to="/customer/fund-transfer"  style={{ paddingLeft: "20px" }}>Thanh toán </Link>
              </Menu.Item>

              <Menu.Item key="23">
                <Link to="/customer/transfer" style={{ paddingLeft: "20px" }}> Chuyển khoản ngoài hệ thống </Link>
              </Menu.Item>

              <Menu.Item key="24"> 
                <Link to="/customer/debs" style={{ paddingLeft: "20px" }}>Quản lý nhắc nợ</Link>
              </Menu.Item>

              <Menu.Item key="25">
                <Link to="/customer/receivers-management" style={{ paddingLeft: "20px" }}>Quản lý danh sách người nhận</Link>
              </Menu.Item>
              <Menu.Item key="26">
                <Link to="/customer/transaction-history" style={{ paddingLeft: "20px" }}> Lịch sử giao dịch </Link>
              </Menu.Item>

              <Menu.Item key="27"> 
                <Link to="/customer/change-password" style={{ paddingLeft: "20px" }}>Đổi mật khẩu</Link>
              </Menu.Item>
            </Menu>
            <Menu.Item key="3" icon={<HistoryOutlined />}>
              <Link to="#">Liên hệ</Link>
            </Menu.Item>
            <Menu.Item  key="4"  icon={<LoginOutlined />} onClick={() => {localStorage.clear(); window.location.replace(`/login`); }}>
              Đăng xuất
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Switch>
            <Route exact path="/customer" component={Home} />
            <Route path="/customer/profile" component={Profile}></Route>
            <Route path="/customer/fund-transfer" component={FundTransfer} />
            <Route path="/customer/receivers-management" component={ReceiversManagement} />        
            <Route path="/customer/transaction-history" component={TransactionHistory}/>
            <Route path="/customer/transfer" component={outside} />
            <Route path="/customer/change-password"  component={ChangePassword} />
            <Route path="/customer/debs" component={Debs} />
            
          </Switch>
        </Layout>
      </Layout>
    </Router>
  );
}



function Home(props) {
  return (
    <div>This is Home</div>
  )
}

export default App;