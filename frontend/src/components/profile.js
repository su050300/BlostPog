/* eslint-disable */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
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
    Axios.get("http://localhost:9000/login").then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
      }
    });
    Axios.get("http://localhost:9000/profile").then((res) => {
      console.log(res.data.profile);
    });
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
