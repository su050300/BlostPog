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
      blogs:'',
      blog:'',
    };
  }
  async componentWillMount() {
    await this.fetchData();
  }
  fetchData = () => {
    Axios.get("http://localhost:9000/save/blogs").then((res) => {
        this.setState({blogs:res.data.blogs});
        console.log(res.data.blogs);
      });
  }
  render() {
    return (
      <div>
        <NavBar />
        <Container>
          {this.state.blogs}
        </Container>
      </div>
    );
  }
}
export default withRouter(Profile);
