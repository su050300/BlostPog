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
  Media,
} from "react-bootstrap";
import { parseblog } from "./parseblogs";
import { Redirect, withRouter } from "react-router-dom";
import uuid from "react-uuid";
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
      tag: {
        status: "",
        success: false,
        all: "",
        show: [],
        count: "",
        delstatus: "",
      },
      category: {
        status: "",
        success: false,
        all: "",
        show: [],
        count: "",
        delstatus: "",
      },
      blogs: {
        pending: [],
        accepted: [],
      },
      isadminLogin: false,
      loginStatus: "",
      registerStatus: "",
      forgotOrlogin: false,
      loaded: false,
    };
  }
  componentWillMount() {
    Axios.get("http://localhost:9000/admin/login").then((res) => {
      if (res.data.loggedIn == true) {
        this.setState({ isadminLogin: true });
        this.getTags();
        this.getCategories();
        this.getPendingBlogs();
        this.getAcceptedBlogs();
      } else {
        this.props.history.push("/admin");
        this.setState({ isadminLogin: false });
      }
    });
    this.setState({ loaded: true });
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
      if(response.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var temp = this.state.tag;
      temp.status = response.data.message;
      temp.success = response.data.success;
      this.setState({
        tag: temp,
      });
      if (response.data.success) {
        setTimeout(() => {
          var temp = this.state.tag;
          temp.status = "";
          temp.success = false;
          this.setState({
            tag: temp,
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
      if(response.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var temp = {...this.state.category};
      temp.status = response.data.message;
      temp.success = response.data.success;
      this.setState({
        category: temp,
      });
      if (response.data.success) {
        setTimeout(() => {
          var temp = {...this.state.category};
          temp.status = "";
          temp.success = false;
          this.setState({
            category: temp,
          });
        }, 4000);
        this.getCategories();
      }
    });
  };

  getTags = (event) => {
    Axios.get("http://localhost:9000/admin/allTag").then((res) => {
      if(res.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var temp = this.state.tag;
      temp.all = res.data.tags;
      temp.count = res.data.count;
      this.setState({
        tag: temp,
      });
      this.showTags();
    });
  };

  getCategories = (event) => {
    Axios.get("http://localhost:9000/admin/allCategories").then((res) => {
      if(res.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var temp = this.state.category;
      temp.all = res.data.categories;
      temp.count = res.data.count;
      this.setState({
        category: temp,
      });
      this.showCategories();
    });
  };

  getPendingBlogs = (event) => {
    Axios.get("http://localhost:9000/admin/pendingblogs").then((res) => {
      if(res.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var blogs = res.data.blogs;
      var result = [];
      blogs.forEach((element) => {
        var url = "/admin/" + element.slug;
        var src =
          "https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20";

        var content = JSON.parse(element.content);
        content.blocks.forEach((element) => {
          if (element.type == "imageurl") {
            src = element.data.url;
            return;
          }
        });
        result.push(
          <a href={url} key={uuid()}>
            <Container key={uuid()} style={{ marginTop: "5%", marginBottom: "5%" }}>
              <Media style={{ margin: "0% 3%" }}>
                <img
                  width={190}
                  height={120}
                  className="mr-3"
                  src={src}
                  alt={element.title}
                />
                <Media.Body className={Styles.fixed}>
                  <h4 className="text-bold">{element.title}</h4>
                  <p>{parseblog.parse(content)}</p>
                </Media.Body>
              </Media>
            </Container>
          </a>
        );
      });
      var temp = this.state.blogs;
      temp.pending = result;
      this.setState({
        blogs: temp,
      });
    });
  };

  getAcceptedBlogs = (event) => {
    Axios.get("http://localhost:9000/admin/acceptedblogs").then((res) => {
      if(res.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var blogs = res.data.blogs;
      var result = [];
      blogs.forEach((element) => {
        var url = "/admin/" + element.slug;
        var src =
          "https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20";

        var content = JSON.parse(element.content);
        content.blocks.forEach((element) => {
          if (element.type == "imageurl") {
            src = element.data.url;
            return;
          }
        });
        result.push(
          <a href={url} key={uuid()}>
            <Container style={{ marginTop: "5%", marginBottom: "5%" }}>
              <Media style={{ margin: "0% 3%" }}>
                <img
                  width={190}
                  height={120}
                  className="mr-3"
                  src={src}
                  alt={element.title}
                />
                <Media.Body className={Styles.fixed}>
                  <h4 className="text-bold">{element.title}</h4>
                  <p>{parseblog.parse(content)}</p>
                </Media.Body>
              </Media>
            </Container>
          </a>
        );
      });
      var temp = this.state.blogs;
      temp.accepted = result;
      this.setState({
        blogs: temp,
      });
    });
  };

  showTags = () => {
    var length = this.state.tag.all.length;
    var temp = this.state.tag;
    temp.show = [];
    this.setState({
      tag: temp,
    });
    var table = this.state.tag.show;
    for (var i = 0; i < length; i++) {
      var key = Object.keys(this.state.tag.all[i])[0];
      var value = this.state.tag.all[i][key];
      var tem = [];
      if (this.state.tag.count[i] == 0) {
        tem.push(
          <Button
            size="sm"
            onClick={(event) => this.deleteTag(event)}
            id={key}
            variant="info"
            key={uuid()}
            block
          >
            Delete
          </Button>
        );
      }
      table.push(
        <tr>
          <td>{i + 1}</td>
          <td>{value}</td>
          <td>{tem}</td>
        </tr>
      );
    }
    temp.show = table;
    this.setState({
      tag: temp,
    });
  };

  showCategories = () => {
    var length = this.state.category.all.length;
    var temp = this.state.category;
    temp.show = [];
    this.setState({
      category: temp,
    });
    var table = this.state.category.show;
    for (var i = 0; i < length; i++) {
      var key = Object.keys(this.state.category.all[i])[0];
      var value = this.state.category.all[i][key];
      var tem = [];
      if (this.state.category.count[i] == 0) {
        tem.push(
          <Button
            size="sm"
            onClick={(event) => this.deleteCatgeory(event)}
            variant="info"
            id={key}
            key={uuid()}
            block
          >
            Delete
          </Button>
        );
      }
      table.push(
        <tr>
          <td>{i + 1}</td>
          <td>{value}</td>
          <td>{tem}</td>
        </tr>
      );
    }
    temp.show = table;
    this.setState({
      category: temp,
    });
  };

  deleteTag = (event) => {
    var tagId = event.target.id;
    Axios.post("http://localhost:9000/admin/deleteTag", {
      tagId: tagId,
    }).then((response) => {
      if(response.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var temp = this.state.tag;
      temp.delstatus = response.data.message;
      this.setState({
        tag: temp,
      });
      setTimeout(() => {
        temp = this.state.tag;
        temp.delstatus = "";
        this.setState({
          tag: temp,
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
      if(response.data.loggedIn==false){
        this.props.history.push("/");
        this.props.history.push("/admin");
      }
      var temp = this.state.category;
      temp.delstatus = response.data.message;
      this.setState({
        category: temp,
      });
      setTimeout(() => {
        temp = this.state.category;
        temp.delstatus = "";
        this.setState({
          category: temp,
        });
      }, 4000);
      this.getCategories();
    });
  };

  render() {
    const isadminLogin = this.state.isadminLogin;
    const registerStatus = this.state.registerStatus;
    const loginStatus = this.state.loginStatus;
    const tagStatus = this.state.tag.status;
    const tagSuccess = this.state.tag.success;
    const categoryStatus = this.state.category.status;
    const categorySuccess = this.state.category.success;
    const delTagStatus = this.state.tag.delstatus;
    const delCategoryStatus = this.state.category.delstatus;
    const pendingblogs = this.state.blogs.pending;
    const acceptedblogs = this.state.blogs.accepted;
    if (this.state.loaded == false) {
      return <div></div>;
    }
    return (
      <div>
        {isadminLogin == true ? (
          <div style={{ display: "none" }}></div>
        ) : (
          <Navbar className="defcolor" bg="none" variant="dark" sticky="top">
            <Navbar.Brand href="/admin">Admin</Navbar.Brand>
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
          </Navbar>
        )}
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
                  <hr width="100%" className="my-3" color="white"></hr>
                  <ListGroup.Item action href="#link5">
                    Pending Blogs
                  </ListGroup.Item>
                  <ListGroup.Item action href="#link6">
                    Accepted Blogs
                  </ListGroup.Item>

                  <Navbar fixed="bottom">
                    <Nav.Link onClick={() => this.logout()}>Logout</Nav.Link>
                  </Navbar>
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
                          <tbody>{this.state.tag.show}</tbody>
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
                          <tbody>{this.state.category.show}</tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="#link5">
                    {pendingblogs.length > 0 ? (
                      <Container>{pendingblogs}</Container>
                    ) : (
                      <h4 className="text-center">No pending blogs</h4>
                    )}
                  </Tab.Pane>

                  <Tab.Pane eventKey="#link6">
                    {acceptedblogs.length > 0 ? (
                      <Container>{acceptedblogs}</Container>
                    ) : (
                      <h4 className="text-center">No accepted blogs</h4>
                    )}
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
