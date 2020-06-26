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
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import PrivateRoute from "./components/common/PrivateRoute";
import ManagementPageComponent from "./containers/administrator/managementPage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
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
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
            <Menu.Item key="1" icon={<UserOutlined />}> 
            <Link to="/employee/create-customer">Tạo tài khoản khách hàng</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            <Link to="/employee/recharge-account">Nạp tiền vào tài khoản</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
            <Link to="/admin/management">Quản lý nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              nav 4
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Switch>
                <PrivateRoute exact path="/employee/create-customer" component={createCustomer} />
                <PrivateRoute exact path='/employee/recharge-account' component={rechargeAccount} />
                <PrivateRoute exact path='/admin/management' component={ManagementPageComponent} />
              </Switch>

            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
