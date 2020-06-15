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
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  getUserInfo = async () => {
    const res = await httpClient.get('/customer/info');
    if (res && res.status === "sucessful") {
      this.setState({ user: res.data })
    }
  }

  componentDidMount() {
    this.getUserInfo();
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
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
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
                <Route exact path="/employee/create-customer" component={createCustomer} />
                <Route exact path='/employee/about' component={() => <h1>Create Customer</h1>} />
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
