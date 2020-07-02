import React from "react";
import "./App.less";
import { Layout, Menu } from "antd";
import httpClient from './utils/httpClient';
import LoginComponent from './components/login/login';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom'
import createCustomer from './components/employee/createCustomer'
import rechargeAccount from './components/employee/rechargeAccount'
import transactionHistory from './components/employee/transactionHistory'
import accountHistory from './components/employee/accountHistory'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined,
  HistoryOutlined,
  LoginOutlined
} from "@ant-design/icons";
import PrivateRoute from "./components/common/PrivateRoute";
import ManagementPageComponent from "./containers/administrator/managementPage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
    this.handleSignOut=this.handleSignOut.bind(this)
  }

  handleSignOut(){
    localStorage.clear()
    this.props.history.push(`/login`);
  }

  render() {
    const { Header, Content, Footer, Sider } = Layout;
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
          }}
        >
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/employee/create-customer">Tạo tài khoản khách hàng</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<MoneyCollectOutlined />}>
              <Link to="/employee/recharge-account">Nạp tiền vào tài khoản</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<HistoryOutlined />}>
              <Link to="/employee/transaction-history">Lịch sử giao dịch</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<LoginOutlined />} onClick={this.handleSignOut}>
              Đăng xuất
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: "24px 16px 17px 17px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24 }}
            >
              <Switch>
                <PrivateRoute exact path="/employee/create-customer" component={createCustomer} />
                <PrivateRoute exact path='/employee/recharge-account' component={rechargeAccount} />
                <PrivateRoute exact path='/employee/transaction-history' component={transactionHistory} />
                <PrivateRoute exact path={`/employee/accountHistory/:accountId`} component={accountHistory} />
              </Switch>

            </div>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer> */}
        </Layout>
      </Layout>
    );
  }
}

export default App;
