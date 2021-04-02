/* eslint-disable */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import Axios from "axios";
import { Button, Navbar, Nav, Form, Modal, Alert } from "react-bootstrap";
export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      loginModal: false,
      signupModal: false,
      user: {
        name: "",
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
    };
  }
  componentWillMount() {
    Axios.get("http://localhost:9000/login").then((res) => {
      if (res.data.loggedIn == true) {
        this.setState({ isLogin: true });
      } else {
        this.setState({ isLogin: false });
      }
    });
    console.log(this.state.isLogin);
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
    console.log(this.state.loginUser);
  };
  validate = (user) => {};
  register = (event) => {
    event.preventDefault();
    // validate(user);
    Axios.post("http://localhost:9000/register", {
      user: this.state.user,
    }).then((response) => {
      this.setState({ registerStatus: response.data.message });
    });
  };
  login = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:9000/login", {
      user: this.state.loginUser,
    }).then((response) => {
      this.setState({ isLogin: true });
      this.setState({ loginStatus: response.data.message });
    });
  };
  loginModalHide = () => {
    this.setState({ loginModal: false });
  };
  loginModalShow = () => {
    this.setState({ loginModal: true });
    this.setState({ signupModal: false });
  };

  signupModalHide = () => {
    this.setState({ signupModal: false });
  };
  signupModalShow = () => {
    this.setState({ signupModal: true });
    this.setState({ loginModal: false });
  };
  render() {
    var isLogin = this.state.isLogin;
    return (
      <div>
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>

          {isLogin == true ? (
            <Nav className="ml-auto">
              <Nav.Link>user</Nav.Link>
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
                  <Alert variant="danger"> Give it a click if you like.</Alert>
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
                </Modal.Body>
                <Modal.Footer>
                  Not a memeber ?
                  <Nav.Link onClick={() => this.signupModalShow()}>
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
                  <Form onSubmit={this.register}>
                    <Form.Group controlId="formBasicText">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        onChange={this.handleChange}
                        placeholder="Enter name"
                        required
                      />
                    </Form.Group>
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
                  <Nav.Link onClick={() => this.loginModalShow()}>
                    Login
                  </Nav.Link>
                </Modal.Footer>
              </Modal>
            </Nav>
          )}
        </Navbar>
      </div>
    );
  }
}
