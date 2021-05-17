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
      suggested: [],
      profile: [],
      res: [],
    };
  }
  componentDidMount() {
    Axios.post("http://localhost:9000/getblog", {
      slug: this.props.match.params.slug,
    }).then((res) => {
      if (res.data.success == true) {
        this.setState({ ispresent: true });
        var result = [];
        var blog = res.data.data;
        var suggestions = blog.suggestions[0];
        var parseddata = parseblog.parse(blog.content[0]);
        var tags = blog.tag;
        var categories = blog.category;
        var res = [];
        this.setState({ blogid: blog.id[0] });
        this.setState({ author: blog.author[0] });
        this.setState({ comm: blog.comments[0].length });
        categories[0].forEach((element) => {
          res.push(
            <span key={uuid()} className="tag text-capitalize mx-1">
              {element}
            </span>
          );
        });
        tags[0].forEach((element) => {
          res.push(
            <span key={uuid()} className="tag text-capitalize mx-1">
              {element}
            </span>
          );
        });
        this.setState({ res: res });
        result.push(
          <div>
            <Row key={uuid()}>
              <Card className={Styles.fullwidth}>
                <Card.Header>
                  <h3>{blog.title}</h3>
                </Card.Header>
                <Card.Body>{parseddata}</Card.Body>
              </Card>
              <hr
                width="100%"
                className="my-1"
                color="rgba(9, 29, 66, 0.6)"
              ></hr>
            </Row>
          </div>
        );
        var suggest = [];
        suggestions.forEach((element) => {
          var url = `http://localhost:3000/blog/${element.slug}`;
          var src =
            "https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20";

          var content = JSON.parse(element.content);
          content.blocks.forEach((element) => {
            if (element.type == "imageurl") {
              src = element.data.url;
              return;
            }
          });
          var date = new Date(element.updatedAt);
          date = date.toDateString();
          var cont = parseblog.parse(content);
          var title = element.title;
          suggest.push(
            <Col xs={4}>
              <a href={url}>
                <Card className="mr-3">
                  <Card.Header>
                    {date}
                    <p className={Styles.clmp}>{title}</p>
                  </Card.Header>
                  <Card.Body>
                    <img src={src} width="100%"></img>
                    <div className={Styles.clmp3}>{cont}</div>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          );
        });
        this.setState({ suggested: suggest });
        Axios.post("http://localhost:9000/profile/profid", {
          id: this.state.author,
        }).then((res) => {
          if (res.data.success == true) {
            var prof = res.data.profile;
            var avatar = prof.avatar;
            var first_name = prof.first_name;
            var last_name = prof.last_name;
            var date = new Date(prof.updatedAt);
            date = date.toDateString();
            var url = `http://localhost:3000/profile/${prof.user.id}`;
            var result = (
              <a href={url}>
                <Row key={uuid()}>
                  <img src={avatar} height="40" width="60" />
                  <span className="mx-1 my-1 text-white">{first_name}</span>
                  <span className="mx-1 my-1 text-white">{last_name}</span>
                  <span className="mx-1 my-1 text-white">{date}</span>
                </Row>
              </a>
            );
            this.setState({ profile: result });
          }
        });
        setTimeout(() => {
          this.setState({ showblogs: result });
          this.fetch();
          this.setState({ loaded: true });
        }, 1000);
      }
    });
  }
  fetch = () => {
    Axios.post("http://localhost:9000/like/getLikes", {
      blogId: this.state.blogid,
    }).then((res) => {
      if (res.data.success == true) {
        this.setState({ likes: res.data.result.length });
      }
    });
    Axios.post("http://localhost:9000/like/liked", {
      blogId: this.state.blogid,
      authorId: this.state.author,
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
  };
  like = () => {
    Axios.post("http://localhost:9000/like/add", {
      blogId: this.state.blogid,
      profileId: this.state.profileId,
    }).then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        return;
      }
    });
  };
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
            <Container className={Styles.mdef}>{this.state.profile}</Container>
            <Container>
              {this.state.showblogs}
              <Card className={Styles.fullwidth}>
                <Card.Body>
                  <div className="tags">{this.state.res}</div>
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
            <Container>
              <Row>{this.state.suggested}</Row>
            </Container>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(Blog);
