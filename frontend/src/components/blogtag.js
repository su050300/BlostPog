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
import uuid from "react-uuid";
import { parseblog } from "./parseblogs";
export default class BlogTag extends React.Component {
  constructor(props) {
    super(props);
    Axios.defaults.withCredentials = true;
    this.state = {
      showblogs: [],
      loaded: false,
    };
  }
  componentWillMount() {
    Axios.post("http://localhost:9000/getblog/bytag", {
      id: this.props.match.params.id,
    }).then((res) => {
        var blogs = res.data.result;
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
  }
  render() {
    if (this.state.loaded == false) {
      return <NavBar />;
    }
    return (
      <div>
        <NavBar />
        <Container>{this.state.showblogs}</Container>
      </div>
    );
  }
}
