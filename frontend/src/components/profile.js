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
  Card,
} from "react-bootstrap";
import { app } from "./default.js";
import { Redirect, withRouter } from "react-router-dom";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      file: "",
      showprofile: [],
      loaded: false,
      message: "",
      avatar: "",
    };
  }
  componentDidMount() {
    this.fetch();
  }
  fetch = () => {
    Axios.post("http://localhost:9000/profile/id",{
      id:this.props.match.params.id,
    }).then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        return;
      }
      var first_name = res.data.profile.profile.first_name;
      var last_name = res.data.profile.profile.last_name;
      var username = res.data.profile.username;
      var email = res.data.profile.email;
      var bio = res.data.profile.profile.bio;
      var avatar = res.data.profile.profile.avatar;
      this.setState({ avatar: avatar });
      var result = (
        <Card>
          <Card.Header>
            <div className="text-center">
              <img src={avatar} height="100" width="140" />
              <p className="my-2">
                <a href="/profile">{username}</a>
              </p>
            </div>
          </Card.Header>
          <Card.Body style={{ margin: "2% 7%" }}>
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={email} readOnly />
              </Form.Group>
              <Row>
                <Col xs={6}>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      id="first_name"
                      type="text"
                      placeholder="first name"
                      defaultValue={first_name}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId="exampleForm.ControlInput3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      id="last_name"
                      type="text"
                      placeholder="last name"
                      defaultValue={last_name}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  id="bio"
                  rows={4}
                  placeholder="bio"
                  defaultValue={bio}
                />
              </Form.Group>
              <Form.Group controlId="formfile1">
                <Form.File
                  id="avatar"
                  onChange={(e) => {
                    this.setState({ file: e.target.files[0] });
                  }}
                  label="Upload avatar"
                />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center">
            <Button
              onClick={() => {
                this.update();
              }}
              size="md"
              variant="info"
            >
              Submit
            </Button>
          </Card.Footer>
        </Card>
      );
      this.setState({ showprofile: result });
      this.setState({ loaded: true });
    });
  };
  update = async () => {
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    var bio = document.getElementById("bio").value;
    var file = this.state.file;
    if (file != "") {
      const storageRef = app.storage().ref();
      const fileRef = storageRef.child("image/" + file.name);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();
      this.setState({ avatar: fileUrl });
    }
    Axios.post("http://localhost:9000/profile", {
      first_name: first_name,
      last_name: last_name,
      bio: bio,
      avatar: this.state.avatar,
    }).then((res) => {
      this.setState({ message: "profile updated" });
      setTimeout(() => {
        this.setState({ message: "" });
        this.fetch();
      }, 2000);
    });
  };
  render() {
    if (this.state.loaded == false) {
      return <NavBar />;
    }
    return (
      <div>
        <NavBar />
        {this.state.message == "" ? (
          <div></div>
        ) : (
          <Alert className="commonAlert" variant="danger">
            {this.state.message}
          </Alert>
        )}
        <Container style={{ marginTop: "2%", marginBottom: "3%" }}>
          {this.state.showprofile}
        </Container>
      </div>
    );
  }
}
export default withRouter(Profile);
