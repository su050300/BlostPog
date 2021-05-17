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
  Nav,
  Form,
  Modal,
  Alert,
  Container,
  NavDropdown,
  Row,
  Media,
} from "react-bootstrap";
import { Redirect, withRouter } from "react-router-dom";
import Styles from "../css/home.module.css";
import uuid from "react-uuid";
import { parseblog } from "./parseblogs";
class History extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      loaded: false,
      showblogs: [],
    };
  }
  componentDidMount() {
    this.fetch();
  }
  fetch = () => {
    Axios.get("http://localhost:9000/getblog/history").then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        return;
      }
      var blogs = res.data.result;
      var result = [];
      blogs.forEach((element) => {
        var url = "/blog/" + element.slug;
        ("https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20");

        var content = JSON.parse(element.content);
        content.blocks.forEach((element) => {
          if (element.type == "imageurl") {
            src = element.data.url;
            return;
          }
        });
        var date = new Date(element.updatedAt);
        date = date.toDateString();
        result.push(
          <Container key={uuid()} style={{ margin: "5% 0%" }}>
            <Media>
              <Media.Body className={Styles.fixed}>
                <div>
                  <a href={url}>
                    <img
                      width={30}
                      height={30}
                      className="mr-3"
                      src={element.profile.avatar}
                      alt={element.title}
                    />
                    {element.profile.first_name} {element.profile.last_name}
                    <span style={{ bottom: "0" }}>{date}</span>
                  </a>
                </div>
                <a href={url}>
                  <h4 className="text-bold">{element.title}</h4>
                  <div className={Styles.clamp}>{parseblog.parse(content)}</div>
                </a>
              </Media.Body>
              <a href={url}>
                <img
                  width={190}
                  height={120}
                  className="mr-3"
                  src={src}
                  alt={element.title}
                />
              </a>
            </Media>
          </Container>
        );
      });
      this.setState({ showblogs: result });
      this.setState({ loaded: true });
    });
  };
  render() {
    if (this.state.loaded == false) {
      return <NavBar />;
    }
    return (
      <div>
        <NavBar />
        <Container style={{ marginTop: "2%", marginBottom: "3%" }}>
          {this.state.showblogs}
        </Container>
      </div>
    );
  }
}
export default withRouter(History);
