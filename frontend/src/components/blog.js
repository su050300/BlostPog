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
import Tinycomment from "./tinycomment";
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
      loaded: false,
      sho: false,
      author: "",
      blogid: "",
      likes: 0,
      comm: 0,
      lik: [],
    };
  }
  componentDidMount() {
    Axios.post("http://localhost:9000/like/getLikes", {
      blogId: this.state.blogId,
    }).then((res) => {
      if (res.data.success == true) {
        this.setState({ likes: res.data.result.length });
      }
    });
    Axios.post("http://localhost:9000/like/liked", {
      blogId: this.state.blogId,
      authorId: this.state.authorId,
    }).then((res) => {
      if (res.data.loggedIn == false) {
        var data = (
          <Button key={uuid()} size="sm" variant="info" disabled>
            Likes {this.state.likes}
          </Button>
        );
        this.setState({ lik: data });
      }
      if (res.data.success == true) {
        var data = [];
        if (res.data.like == false) {
          data.push(
            <Button key={uuid()} size="sm" variant="info" disabled>
              Likes {this.state.likes}
            </Button>
          );
        } else {
          data.push(
            <Button
              key={uuid()}
              size="sm"
              variant="info"
              onClick={() => this.like()}
            >
              Like {this.state.likes}
            </Button>
          );
        }
        this.setState({ lik: data });
      }
    });
    Axios.post("http://localhost:9000/getblog", {
      slug: this.props.match.params.slug,
    }).then((res) => {
      if (res.data.success == true) {
        this.setState({ ispresent: true });
        var result = [];
        var blog = res.data.data;
        var parseddata = parseblog.parse(blog.content[0]);
        console.log(blog.content[0]);
        var tags = blog.tag;
        var categories = blog.category;
        var res = [];
        this.setState({ blogid: blog.id[0] });
        this.setState({ author: blog.author[0] });
        this.setState({ comm: blog.comments[0].length });
        categories.forEach((element) => {
          res.push(
            <span key={uuid()} className="tag text-capitalize mx-1">
              {element}
            </span>
          );
        });
        tags.forEach((element) => {
          res.push(
            <span key={uuid()} className="tag text-capitalize mx-1">
              {element}
            </span>
          );
        });
        result.push(
          <Row key={uuid()}>
            <Card className={Styles.fullwidth}>
              <Card.Header>
                <h3>{blog.title}</h3>
              </Card.Header>
              <Card.Body>{parseddata}</Card.Body>
            </Card>
            <hr width="100%" className="my-1" color="rgba(9, 29, 66, 0.6)"></hr>
            <Card className={Styles.fullwidth}>
              <Card.Body>
                <div className="tags">{res}</div>
                <div className="likcomm my-4">
                  <span className="my-1 mx-1">{this.state.lik}</span>
                  <span className="my-1 mx-1">
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => this.setShow()}
                    >
                      Comments {this.state.comm}
                    </Button>
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Row>
        );
        setTimeout(() => {
          this.setState({ showblogs: result });
          this.setState({ loaded: true });
        }, 1000);
      }
    });
  }
  like = () => {};
  setShow = () => {
    this.setState({ sho: true });
  };
  setHide = () => {
    this.setState({ sho: false });
  };
  render() {
    if (this.state.loaded == false) {
      return <NavBar />;
    }
    return (
      <div>
        <NavBar />
        {this.state.ispresent == false ? (
          <h4 className="text-center text-white">Blog Not Found</h4>
        ) : (
          <div>
            <Container className={Styles.mdef}>
              {this.state.showblogs}
            </Container>
            <Modal
              show={this.state.sho}
              onHide={() => this.setHide()}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-styling-title"
            >
              <Modal.Header closeButton>Comments</Modal.Header>
              <Modal.Body>
                <Tinycomment
                  id={this.state.blogid}
                  author={this.state.author}
                />
              </Modal.Body>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(Blog);
