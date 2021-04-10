/* eslint-disable */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import Axios from "axios";
import ForgetPassword from "./forgetPassword";
import { Button, Navbar, Nav, Form, Modal, Alert } from "react-bootstrap";
import { Redirect, withRouter } from "react-router-dom";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      profile:{
          first_name:'',
          last_name:'',
          bio:'',
          avatarlink:'',
      },
    };
  }
  componentWillMount() {
    
  }
  render() {
    return <div></div>;
  }
}
export default withRouter(Profile);
