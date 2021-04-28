/* eslint-disable */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/global.css";
import Styles from "../css/admin.module.css";
import Axios from "axios";
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
  Table,
} from "react-bootstrap";
import { Redirect, withRouter } from "react-router-dom";
class Admin extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      loginModal: false,
      signupModal: false,
      user: {
        username: "",
        password: "",
        email: "",
      },
      loginUser: {
        username: "",
        password: "",
      },
      isadminLogin: false,
      loginStatus: "",
      registerStatus: "",
      forgotOrlogin: false,
      tagStatus: "",
      tagSuccess: false,
      categoryStatus: "",
      categorySuccess: false,
      allTags: "",
      allCategorie: "",
      showTags: [],
      showCategories: [],
      delTagStatus: "",
      delCategoryStatus: "",
    };
  }
  componentWillMount() {
    Axios.get("http://localhost:9000/admin/login").then((res) => {
      if (res.data.loggedIn == true) {
        this.setState({ isadminLogin: true });
        this.getTags();
        this.getCategories();
      } else {
        this.props.history.push("/admin");
        this.setState({ isadminLogin: false });
      }
    });
  }
  handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    const newUser = this.state.user;
    newUser[field] = value;
    this.setState({ user: newUser });
  };
  handleLoginChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    const newUser = this.state.loginUser;
    newUser[field] = value;
    this.setState({ loginUser: newUser });
  };
  validate = (user) => {};
  register = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:9000/admin/register", {
      user: this.state.user,
    }).then((response) => {
      if (response.data.registered == true) {
        this.props.history.push("/admin/register");
        this.props.history.push("/admin");
      }
    });
  };
  login = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:9000/admin/login", {
      user: this.state.loginUser,
    }).then((response) => {
      this.setState({ loginStatus: response.data.message });
      if (response.data.loggedIn == false) {
        // setTimeout(() => {
        //   this.props.history.push("/login");
        //   this.props.history.push("/admin");
        // }, 2000);
      } else {
        this.props.history.push("/login");
        this.props.history.push("/admin");
      }
    });
  };
  logout = () => {
    Axios.get("http://localhost:9000/admin/logout").then((res) => {
      this.props.history.push("/admin/logout");
      this.props.history.push("/admin");
    });
  };
  loginModalHide = () => {
    this.setState({ loginModal: false });
    this.setState({ loginStatus: "" });
    this.setState({ registerStatus: "" });
  };
  loginModalShow = () => {
    this.setState({ loginModal: true });
    this.setState({ signupModal: false });
    this.setState({ loginStatus: "" });
    this.setState({ registerStatus: "" });
  };

  signupModalHide = () => {
    this.setState({ signupModal: false });
    this.setState({ loginStatus: "" });
    this.setState({ registerStatus: "" });
  };
  signupModalShow = () => {
    this.setState({ signupModal: true });
    this.setState({ loginModal: false });
    this.setState({ loginStatus: "" });
    this.setState({ registerStatus: "" });
  };

  addTag = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:9000/admin/addTag", {
      tag: document.getElementById("tag").value,
    }).then((response) => {
      this.setState({
        tagSuccess: response.data.success,
        tagStatus: response.data.message,
      });
      if (response.data.success) {
        setTimeout(() => {
          this.setState({
            tagStatus: "",
            tagSuccess: false,
          });
        }, 4000);
      }
      this.getTags();
    });
  };

  addCategory = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:9000/admin/addCategory", {
      category: document.getElementById("category").value,
    }).then((response) => {
      this.setState({
        categorySuccess: response.data.success,
        categoryStatus: response.data.message,
      });
      if (response.data.success) {
        setTimeout(() => {
          this.setState({
            categoryStatus: "",
            categorySuccess: false,
          });
        }, 4000);
        this.getCategories();
      }
    });
  };

  getTags = (event) => {
    Axios.get("http://localhost:9000/admin/allTag").then((res) => {
      this.setState({ allTags: res.data.tags });
      this.showTags();
    });
  };

  getCategories = (event) => {
    Axios.get("http://localhost:9000/admin/allCategories").then((res) => {
      this.setState({ allCategories: res.data.categories });
      this.showCategories();
    });
  };

  showTags = () => {
    var length = this.state.allTags.length;
    this.setState({ showTags: [] });
    var table = this.state.showTags;
    for (var i = 0; i < length; i++) {
      var key = Object.keys(this.state.allTags[i])[0];
      var value = this.state.allTags[i][key];
      table.push(
        <tr>
          <td>{i + 1}</td>
          <td>{value}</td>
          <td>
            <Button
              size="sm"
              onClick={(event) => this.deleteTag(event)}
              id={key}
              variant="info"
              block
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    }
    this.setState({ showTags: table });
  };

  showCategories = () => {
    var length = this.state.allCategories.length;
    this.setState({ showCategories: [] });
    var table = this.state.showCategories;
    for (var i = 0; i < length; i++) {
      var key = Object.keys(this.state.allCategories[i])[0];
      var value = this.state.allCategories[i][key];
      table.push(
        <tr>
          <td>{i + 1}</td>
          <td>{value}</td>
          <td>
            <Button
              size="sm"
              onClick={(event) => this.deleteCatgeory(event)}
              variant="info"
              id={key}
              block
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    }
    this.setState({ showCatgeories: table });
  };

  deleteTag = (event) => {
    var tagId = event.target.id;
    Axios.post("http://localhost:9000/admin/deleteTag", {
      tagId: tagId,
    }).then((response) => {
      this.setState({ delTagStatus: response.data.message });
      setTimeout(() => {
        this.setState({
          delTagStatus: "",
        });
      }, 4000);
      this.getTags();
    });
  };

  deleteCatgeory = (event) => {
    var categoryId = event.target.id;
    Axios.post("http://localhost:9000/admin/deleteCategory", {
      categoryId: categoryId,
    }).then((response) => {
      this.setState({ delCategoryStatus: response.data.message });
      setTimeout(() => {
        this.setState({
          delCategoryStatus: "",
        });
      }, 4000);
      this.getCategories();
    });
  };

  render() {
    const isadminLogin = this.state.isadminLogin;
    const registerStatus = this.state.registerStatus;
    const loginStatus = this.state.loginStatus;
    const tagStatus = this.state.tagStatus;
    const tagSuccess = this.state.tagSuccess;
    const categoryStatus = this.state.categoryStatus;
    const categorySuccess = this.state.categorySuccess;
    const delTagStatus = this.state.delTagStatus;
    const delCategoryStatus = this.state.delCategoryStatus;
    return (
      <div>
        <Navbar className="defcolor" bg="none" variant="dark" sticky="top">
          <Navbar.Brand href="#home">Admin</Navbar.Brand>

          {isadminLogin == true ? (
            <Nav className="ml-auto">
              <NavDropdown
                title={
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20"
                    height="35px"
                    width="40px"
                  ></img>
                }
              >
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => this.logout()}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="ml-auto">
              <Nav.Link onClick={() => this.loginModalShow()}>Login</Nav.Link>
              <Modal
                show={this.state.loginModal}
                onHide={() => this.loginModalHide()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  {loginStatus == "" ? (
                    <div></div>
                  ) : (
                    <Alert variant="danger">{loginStatus}</Alert>
                  )}
                  <Form onSubmit={this.login}>
                    <Form.Group controlId="formBasicUser">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        onChange={this.handleLoginChange}
                        placeholder="Enter username"
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        onChange={this.handleLoginChange}
                        placeholder="Password"
                        required
                      />
                    </Form.Group>
                    <Button variant="info" type="submit">
                      Login
                    </Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  Not a memeber ?
                  <Nav.Link
                    className="text-info"
                    onClick={() => this.signupModalShow()}
                  >
                    Signup
                  </Nav.Link>
                </Modal.Footer>
              </Modal>
              <Modal
                show={this.state.signupModal}
                onHide={() => this.signupModalHide()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  {registerStatus == "" ? (
                    <div></div>
                  ) : (
                    <Alert variant="danger">{registerStatus}</Alert>
                  )}
                  <Form onSubmit={this.register}>
                    <Form.Group controlId="formBasicUserName">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        onChange={this.handleChange}
                        placeholder="Enter user name"
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        placeholder="Enter email"
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        placeholder="Password"
                        required
                      />
                    </Form.Group>
                    <Button variant="info" type="submit">
                      Register
                    </Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  Already a memeber ?
                  <Nav.Link
                    className="text-info"
                    onClick={() => this.loginModalShow()}
                  >
                    Login
                  </Nav.Link>
                </Modal.Footer>
              </Modal>
            </Nav>
          )}
        </Navbar>
        {isadminLogin == true ? (
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
              <Col xs={2}>
                <ListGroup>
                  <ListGroup.Item action href="#link1">
                    Add Category
                  </ListGroup.Item>
                  <ListGroup.Item action href="#link2">
                    Add Tag
                  </ListGroup.Item>
                  <hr width="100%" className="my-3" color="white"></hr>
                  <ListGroup.Item action href="#link3">
                    All Tags
                  </ListGroup.Item>
                  <ListGroup.Item action href="#link4">
                    All Categories
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col xs={10}>
                <Tab.Content className={Styles.tabMargin}>
                  <Tab.Pane eventKey="#link1">
                    <Card>
                      <Card.Header className="text-center">
                        Add categories
                        {categorySuccess == true ? (
                          <Alert variant="success">{categoryStatus}</Alert>
                        ) : (
                          <div style={{ display: "none" }}></div>
                        )}
                        {categorySuccess == false && categoryStatus != "" ? (
                          <Alert variant="danger">{categoryStatus}</Alert>
                        ) : (
                          <div style={{ display: "none" }}></div>
                        )}
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={this.addCategory}>
                          <Form.Group>
                            <Form.Label className="my-2">Category</Form.Label>
                            <Form.Control
                              type="text"
                              name="category"
                              placeholder="Enter category"
                              id="category"
                              required
                            />
                          </Form.Group>
                          <Button
                            className="mt-2"
                            variant="info"
                            size="md"
                            type="submit"
                            block
                          >
                            Add
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link2">
                    <Card>
                      <Card.Header className="text-center">
                        Add tags
                        {tagSuccess == true ? (
                          <Alert variant="success">{tagStatus}</Alert>
                        ) : (
                          <div style={{ display: "none" }}></div>
                        )}
                        {tagSuccess == false && tagStatus != "" ? (
                          <Alert variant="danger">{tagStatus}</Alert>
                        ) : (
                          <div style={{ display: "none" }}></div>
                        )}
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={this.addTag}>
                          <Form.Group>
                            <Form.Label className="my-2">Tag</Form.Label>
                            <Form.Control
                              type="text"
                              name="tag"
                              placeholder="Enter tag"
                              id="tag"
                              required
                            />
                          </Form.Group>
                          <Button
                            className="mt-2"
                            variant="info"
                            size="md"
                            type="submit"
                            block
                          >
                            Add
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link3">
                    <Card className="px-5 py-5">
                      <Card.Header
                        style={{ backgroundColor: "#0a1f44" }}
                        className="text-center"
                      >
                        All tags
                        {delTagStatus == "" ? (
                          <div></div>
                        ) : (
                          <Alert variant="success">{delTagStatus}</Alert>
                        )}
                      </Card.Header>
                      <Card.Body>
                        <Table
                          className="text-center text-capitalize"
                          striped
                          bordered
                          hover
                          variant="dark"
                        >
                          <tbody>{this.state.showTags}</tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link4">
                    <Card className="px-5 py-5">
                      <Card.Header
                        style={{ backgroundColor: "#0a1f44" }}
                        className="text-center"
                      >
                        All Categories
                        {delCategoryStatus == "" ? (
                          <div></div>
                        ) : (
                          <Alert variant="success">{delCategoryStatus}</Alert>
                        )}
                      </Card.Header>
                      <Card.Body>
                        <Table
                          className="text-center text-capitalize"
                          striped
                          bordered
                          hover
                          variant="dark"
                        >
                          <tbody>{this.state.showCatgeories}</tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        ) : (
          <h4 className="mt-5 text-center text-white">Login To Continue</h4>
        )}
      </div>
    );
  }
}
export default withRouter(Admin);
