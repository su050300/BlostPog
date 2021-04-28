/* eslint-disable */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/global.css";
import Axios from "axios";
import NavBar from "./navbar";
import ForgetPassword from "./forgetPassword";
import {
  Button,
  Navbar,
  Row,
  Container,
  Nav,
  Form,
  Modal,
  Alert,
  Col,
} from "react-bootstrap";
import { Redirect, withRouter } from "react-router-dom";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      profile: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        bio: "",
        avatar: "",
        followers: "",
      },
    };
  }
  componentWillMount() {
    this.fetchData();
  }
  fetchData = () => {

  }
  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <Row>
            
          </Row>
        </Container>
      </div>
    );
  }
}
export default withRouter(Profile);
