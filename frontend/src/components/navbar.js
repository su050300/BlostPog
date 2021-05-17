// /* eslint-disable */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "../css/navbar.module.css";

import SearchField from "react-search-field";
import Axios from "axios";
import ForgetPassword from "./forgetPassword";
import {
  Button,
  Navbar,
  Nav,
  Form,
  Modal,
  Alert,
  Container,
  NavDropdown,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { Redirect, withRouter } from "react-router-dom";
import uuid from "react-uuid";
class NavBar extends React.Component {
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
      isLogin: false,
      loginStatus: "",
      registerStatus: "",
      forgotOrlogin: false,
      showsearch: [],
      profileurl: "",
    };
  }
  componentDidMount() {
    Axios.get("http://localhost:9000/login").then((res) => {
      if (res.data.loggedIn == true) {
        this.setState({
          profileurl: `http://localhost:3000/profile/${res.data.id}`,
        });
        this.setState({ isLogin: true });
      } else {
        // this.props.history.push('/');
        this.setState({ isLogin: false });
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
    // validate(user);
    Axios.post("http://localhost:9000/register", {
      user: this.state.user,
    }).then((response) => {
      this.setState({ registerStatus: response.data.message });
      if (response.data.registered == true) {
        this.props.history.push("/register");
        setTimeout(() => {
          this.props.history.push("/");
        }, 10000);
      }
    });
  };
  login = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:9000/login", {
      user: this.state.loginUser,
    }).then((response) => {
      this.setState({ loginStatus: response.data.message });
      console.log(response.data.loggedIn);
      if (response.data.loggedIn == false) {
        this.setState({
          profileurl: `http://localhost:3000/profile/${response.data.user.id}`,
        });
        setTimeout(() => {
          this.props.history.push("/login");
          this.props.history.push("/");
        }, 2000);
      } else {
        this.props.history.push("/login");
        this.props.history.push("/");
      }
    });
  };
  logout = () => {
    Axios.get("http://localhost:9000/logout").then((res) => {
      this.props.history.push("/logout");
      this.props.history.push("/");
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

  search = () => {
    var text = document.getElementById("text").value;
    Axios.post("http://localhost:9000/search/title", {
      text: text,
    }).then((res) => {
      var result = [];
      res.data.results.forEach((element) => {
        var slug = element[1];
        var url = `http://localhost:3000/blog/${slug}`;
        result.push(
          <Dropdown.Item key={uuid()} href={url}>
            {element[2]}
          </Dropdown.Item>
        );
      });
      this.setState({ showsearch: result });
    });
  };

  searchByTag = (e) => {
    var text = e.target.value;
    Axios.post("http://localhost:9000/search/tag", {
      text: text,
    }).then((res) => {
      var result = [];
      res.data.tags.forEach((element) => {
        var id = element.id;
        var url = `http://localhost:3000/tag/${id}`;
        result.push(
          <Dropdown.Item key={uuid()} href={url}>
            {element.tag}
          </Dropdown.Item>
        );
      });
      this.setState({ showsearch: result });
    });
  };
  render() {
    var isLogin = this.state.isLogin;
    var registerStatus = this.state.registerStatus;
    var loginStatus = this.state.loginStatus;
    return (
      <div className="encloser">
        <Navbar className="defcolor" bg="none" variant="dark" static="top">
          <Navbar.Brand href="#home">BlogPost</Navbar.Brand>

          {isLogin == true ? (
            <Nav className="ml-auto">
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Search by tag"
                  className="mr-sm-2"
                  id="text"
                  onChange={(e) => {
                    this.searchByTag(e);
                  }}
                  autoComplete="off"
                />
                <Button
                  variant="outline-info"
                  onClick={(e) => {
                    this.search();
                  }}
                >
                  Search By Title
                </Button>
              </Form>
              <NavDropdown
                title={
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20"
                    height="35px"
                    width="40px"
                  ></img>
                }
              >
                <NavDropdown.Item href={this.state.profileurl}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="/editor">
                  Write Your Story
                </NavDropdown.Item>
                <NavDropdown.Item href="/history">History</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => this.logout()}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="ml-auto">
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Search by tag"
                  className="mr-sm-2"
                  id="text"
                  onChange={(e) => {
                    this.searchByTag(e);
                  }}
                  autoComplete="off"
                />
                <Button
                  variant="outline-info"
                  onClick={(e) => {
                    this.search();
                  }}
                >
                  Search By Title
                </Button>
              </Form>
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
                  {this.state.forgotOrlogin == false ? (
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
                      <Button variant="primary" type="submit">
                        Login
                      </Button>
                    </Form>
                  ) : (
                    <ForgetPassword />
                  )}
                </Modal.Body>
                <Modal.Footer>
                  Not a memeber ?
                  <Nav.Link
                    className="text-info"
                    onClick={() => this.signupModalShow()}
                  >
                    Signup
                  </Nav.Link>
                  {this.state.forgotOrlogin == false ? (
                    <Nav.Link
                      className="text-info"
                      onClick={() => this.setState({ forgotOrlogin: true })}
                    >
                      forgot password
                    </Nav.Link>
                  ) : (
                    <Nav.Link
                      className="text-info"
                      onClick={() => this.setState({ forgotOrlogin: false })}
                    >
                      login
                    </Nav.Link>
                  )}
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
                    <Button variant="primary" type="submit">
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
        {this.state.showsearch.length > 0 ? (
          <div
            style={{
              position: "absolute",
              width: "250px",
              maxHeight: "500px",
              background: "#203864",
              left: "70%",
              overflow: "scroll",
            }}
            id="insert"
          >
            {this.state.showsearch}
          </div>
        ) : (
          <div style={{ display: "none" }}></div>
        )}
      </div>
    );
  }
}
export default withRouter(NavBar);
