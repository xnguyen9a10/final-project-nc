import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import LoginComponent from './components/login/login';
import {
  BrowserRouter,
  NavLink,
  Redirect,
  Router,
  Route,
  Switch,
} from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import history from './utils/history';
import { isLogin } from './utils/auth'

ReactDOM.render(
  <BrowserRouter history={history}>
     <Switch>
       <Route exact path={"/login"} render={props => (
         !isLogin() ?
         <LoginComponent />
     : <Redirect to="/" />
       )}/>
      <PrivateRoute component={(App)} path="/employee"/>
     </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
