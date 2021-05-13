/* eslint-disable */
import React, { Component } from "react";
import NavBar from "./navbar";
import Axios from "axios";

import "../css/global.css";
import EditorJS from "@editorjs/editorjs";
import tool from "./editortool.js";
import { Typeahead } from "react-bootstrap-typeahead";
import Styles from "../css/editor.module.css";
import Tinymce from "./tinyuser.js";
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
var editor = new EditorJS({});
class BlogUser extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      ispresent: true,
      selectCategories: [],
      selectTags: [],
      categories: [],
      tags: [],
      title: [],
      blogId: "",
      authorId: "",
      blogStatus: "",
      data: "",
      loaded: false,
    };
  }
  componentWillMount() {
    Axios.post("http://localhost:9000/getblog", {
      slug: this.props.match.params.slug,
    }).then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      if (res.data.success == true) {
        this.setState({ ispresent: true });
        var result = [];
        var blog = res.data.data;
        var parseddata = parseblog.parse(blog.content[0]);
        this.setState({ blogId: blog.id[0] });
        this.setState({ authorId: blog.author[0] });
        this.setState({ selectTags: blog.tag[0] });
        this.setState({ selectCategories: blog.category[0] });
        this.setState({ title: blog.title[0] });
        this.setState({ blogStatus: blog.status[0] });
        this.setState({ data: blog.content[0] });
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
      } else {
        this.setState({ ispresent: false });
      }
    });
    this.getTags();
    this.getCategories();
    setTimeout(() => {
      this.init();
      this.setState({ loaded: true });
    }, 1000);
  }
  init = () => {
    editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      tools: tool,
      data: this.state.data,
      minHeight: 550,
      onReady: () => {
        if (editor) {
          editor.destroy();
          editor = new EditorJS({
            holder: "editorjs",
            autofocus: true,
            tools: tool,
            data: this.state.data,
            minHeight: 550,
          });
        }
        console.log("Editor is ready");
      },
      onChange: (api) => {},
    });
  };
  save = () => {
    editor
      .save()
      .then((outputData) => {
        Axios.post("http://localhost:9000/admin/saveblog", {
          id: this.state.blogId,
          data: outputData,
        }).then((res) => {
          if (res.data.loggedIn == false) {
            this.props.history.push("/");
            this.props.history.push("/admin");
          }
          console.log(res.data.message);
        });
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };
  getTags = () => {
    Axios.get("http://localhost:9000/getTags").then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var result = res.data.tags;
      var length = result.length;
      var temp = [];
      for (var i = 0; i < length; i++) {
        temp.push(result[i][Object.keys(result[i])]);
      }
      this.setState({ tags: temp });
    });
  };
  getCategories = () => {
    Axios.get("http://localhost:9000/getCategories").then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var result = res.data.categories;
      var length = result.length;
      var temp = [];
      for (var i = 0; i < length; i++) {
        temp.push(result[i][Object.keys(result[i])]);
      }
      this.setState({ categories: temp });
    });
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
          <Row style={{ marginTop: "3%" }}>
            <Col xs={7}>
              <Card>
                <Card.Header
                  style={{ backgroundColor: "#0a1f44", margin: "3% 7%" }}
                  className="text-center"
                >
                  {this.state.title}
                </Card.Header>
                <Card.Body className={Styles.fixed} id="editorjs"></Card.Body>
              </Card>
            </Col>
            <Col xs={2}>
              <Card className="ml-3 mr-1">
                <Card.Body>
                  <div className="post-details">
                    <h6>Post Details</h6>
                    <Form>
                      <FormControl
                        type="text"
                        placeholder="title"
                        className="mr-sm-2"
                        name="title"
                        id="title"
                        value={this.state.title}
                      />
                    </Form>
                  </div>
                </Card.Body>
              </Card>
              <Card className="ml-3 mt-3 mr-1">
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Catgeories</Form.Label>
                    <Typeahead
                      id="basic-typeahead-multiple"
                      labelKey="name"
                      multiple
                      onChange={(e) => {
                        this.setState({ categories: e });
                      }}
                      options={this.state.categories}
                      selected={this.state.selectCategories}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="ml-3 mt-3 mr-1">
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Typeahead
                      id="basic-typeahead-multiple"
                      labelKey="name"
                      multiple
                      onChange={(e) => {
                        this.setState({ tags: e });
                      }}
                      options={this.state.tags}
                      selected={this.state.selectTags}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="ml-3 mt-3 mr-1">
                <Card.Body>
                  <div>
                    {this.state.blogStatus == true ? (
                      <p className="text-success">Status : Published</p>
                    ) : (
                      <div>
                        <p className="text-warning">Status : Pending</p>

                        <Button
                          onClick={() => {
                            this.save();
                          }}
                          variant="info"
                          size="md"
                          block
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={3}>
              <Tinymce
                id={this.state.blogId}
                status={this.state.blogStatus}
                author={this.state.authorId}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
export default withRouter(BlogUser);
