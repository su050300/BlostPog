/* eslint-disable */
import React, { Component } from "react";
import NavBar from "./navbar";
import Axios from "axios";

import "../css/global.css";
import Styles from "../css/blog.module.css";
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
  NavDropdown,
  Card,
  Tab,
  ListGroup,
  FormControl,
  Table,
  Image,
  InputGroup,
} from "react-bootstrap";
import { parseblog } from "./parseblogs";
import uuid from "react-uuid";
import { Redirect, withRouter } from "react-router-dom";
class Blog extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      ispresent: false,
      blog: "",
      showblogs: [],
    };
  }
  componentWillMount() {
    Axios.post("http://localhost:9000/getblog", {
      slug: this.props.match.params.slug,
    }).then((res) => {
      if (res.data.success == true) {
        this.setState({ ispresent: true });
        var result = [];
        var blog = res.data.data;
        var parseddata = parseblog.parse(blog.content[0]);
        result.push(
          <Row key={uuid()}>
            <Card className={Styles.fullwidth}>
              <Card.Header>
                <h3>{blog.title}</h3>
              </Card.Header>
              <Card.Body>{parseddata}</Card.Body>
            </Card>
          </Row>
        );
        this.setState({ showblogs: result });
      }
    });
  }
  render() {
    return (
      <div>
        <NavBar />
        {this.state.ispresent == false ? (
          <h4 className="text-center text-white">Blog Not Found</h4>
        ) : (
          <Container className={Styles.mdef}>{this.state.showblogs}</Container>
        )}
      </div>
    );
  }
}
export default withRouter(Blog);
