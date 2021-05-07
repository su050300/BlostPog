/* eslint-disable */
import React, { Component } from "react";
import NavBar from "./navbar";
import Axios from "axios";
import "../css/global.css";
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
import Styles from "../css/home.module.css";
import { parseblog } from "./parseblogs";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      showblogs: [],
    };
  }
  componentWillMount() {
    Axios.get("http://localhost:9000/getblog/all").then((res) => {
      var blogs = res.data.blogs;
      var result = [];
      blogs.forEach((element) => {
        var url = "/blog/" + element.slug;
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
          <a href={url}>
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
                  <p>
                    {parseblog.parse(content)}
                  </p>
                </Media.Body>
              </Media>
            </Container>
          </a>
        );
      });
      this.setState({ showblogs: result });
    });
  }
  render() {
    return (
      <div>
        <NavBar />
        <Container>{this.state.showblogs}</Container>
      </div>
    );
  }
}
