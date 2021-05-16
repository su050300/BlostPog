/* eslint-disable */
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Redirect,withRouter } from "react-router-dom";
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
  Media,
  Image,
  InputGroup,
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import EditorJS from "@editorjs/editorjs";
import { parseblog } from "./parseblogs";
import uuid from "react-uuid";

import NavBar from "./navbar";
import { app } from "./default.js";
import tool from "./editortool.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "../css/editor.module.css";
import "../css/global.css";
import "react-pro-sidebar/dist/css/styles.css";
var editor = new EditorJS({});
function Editor(props) {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectTags, setselectTags] = useState([]);
  const [selectCategories, setselectCategories] = useState([]);
  const [message, setmessage] = useState("");
  const [file, setfile] = useState("");
  const [filemessage, setfilemessage] = useState("");
  const [showimage, setshowimage] = useState([]);
  const [showblogs, setshowblogs] = useState([]);
  const [loaded, setloaded] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    getTags();
    getCategories();
    init();
    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js";
    script.async = true;

    document.body.appendChild(script);
    fetchImages();
    getBlogs();
    setloaded(true);
  }, []);
  var init = () => {
    editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      tools: tool,
      data: {},
      minHeight: 550,
      onReady: () => {
        if (editor) {
          editor.destroy();
          editor = new EditorJS({
            holder: "editorjs",
            autofocus: true,
            tools: tool,
            data: {},
            minHeight: 550,
          });
        }
        console.log("Editor is ready");
      },
      onChange: (api) => {},
    });
  };
  var getTags = () => {
    Axios.get("http://localhost:9000/getblog/getTags").then((res) => {
      if (res.data.loggedIn == false) {
        props.history.push("/");
        return;
      }
      var result = res.data.tags;
      var length = result.length;
      var temp = [];
      for (var i = 0; i < length; i++) {
        temp.push(result[i][Object.keys(result[i])]);
      }
      setTags(temp);
    });
  };
  var getCategories = () => {
    Axios.get("http://localhost:9000/getblog/getCategories").then((res) => {
      if (res.data.loggedIn == false) {
        props.history.push("/");
        return;
      }
      var result = res.data.categories;
      var length = result.length;
      var temp = [];
      for (var i = 0; i < length; i++) {
        temp.push(result[i][Object.keys(result[i])]);
      }
      setCategories(temp);
    });
  };
  var submit = () => {
    editor
      .save()
      .then((outputData) => {
        var title = document.getElementById("title").value;
        console.log(outputData);
        if (title == "") {
          setmessage("title can not be empty");
          setTimeout(() => {
            setmessage("");
          }, 3000);
        } else if (selectTags.length == 0) {
          setmessage("tags can not be empty");
          setTimeout(() => {
            setmessage("");
          }, 3000);
        } else if (selectCategories.length == 0) {
          setmessage("categories can not be empty");
          setTimeout(() => {
            setmessage("");
          }, 3000);
        } else if (outputData.blocks.length < 1) {
          setmessage("Your tag does not have minimum required data");
          setTimeout(() => {
            setmessage("");
          }, 3000);
        } else {
          Axios.post("http://localhost:9000/save/blogs", {
            title: title,
            tags: selectTags,
            categories: selectCategories,
            data: outputData,
          }).then((res) => {
            if (res.data.loggedIn == false) {
              props.history.push("/");
              return;
            }
            setmessage(res.data.message);
            setTimeout(() => {
              setmessage("");
            }, 3000);
            if (editor) {
              editor.destroy();
              editor = new EditorJS({
                holder: "editorjs",
                autofocus: true,
                tools: tool,
                data: {},
                minHeight: 550,
              });
            }
            setselectCategories([]);
            setselectTags([]);
            document.getElementById("title").value = "";
            getBlogs();
          });
        }
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  var upload = async () => {
    if (file == "") {
      setfilemessage("no file is selected");
    } else {
      const storageRef = app.storage().ref();
      const fileRef = storageRef.child("image/" + file.name);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();
      Axios.post("http://localhost:9000/save/image", {
        url: fileUrl,
      }).then((res) => {
        if (res.data.loggedIn == false) {
          props.history.push("/");
          return;
        }
        fetchImages();
      });
    }
  };
  var fileChange = (e) => {
    const file = e.target.files[0];
    setfile(file);
  };
  var fetchImages = () => {
    Axios.get("http://localhost:9000/save/image").then((res) => {
      if (res.data.loggedIn == false) {
        props.history.push("/");
        return;
      }
      var allimages = res.data.result;
      var length = allimages.length;
      if (length == 0) {
        setshowimage(
          <h3 className="text-center" style={{ marginTop: "20vh" }}>
            No images found
          </h3>
        );
      } else {
        var rows = Math.floor(length / 3);
        var result = [];
        for (var i = 0; i < rows; i++) {
          result.push(
            <Row>
              <Col xs={4}>
                <Image
                  src={allimages[i * 3 + 0].url}
                  alt={allimages[i * 3 + 0].id}
                  fluid
                  className={Styles.imgHeight}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Link</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    value={allimages[i * 3 + 0].url}
                    readOnly
                  />
                </InputGroup>
              </Col>
              <Col xs={4}>
                <Image
                  src={allimages[i * 3 + 1].url}
                  alt={allimages[i * 3 + 1].id}
                  fluid
                  className={Styles.imgHeight}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Link</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    value={allimages[i * 3 + 1].url}
                    readOnly
                  />
                </InputGroup>
              </Col>
              <Col xs={4}>
                <Image
                  src={allimages[i * 3 + 2].url}
                  alt={allimages[i * 3 + 2].id}
                  fluid
                  className={Styles.imgHeight}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Link</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    value={allimages[i * 3 + 2].url}
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
          );
        }
        if (length % 3 == 1) {
          result.push(
            <Row>
              <Col>
                <Image
                  src={allimages[rows * 3].url}
                  alt={allimages[rows * 3].id}
                  fluid
                  className={Styles.imgHeight}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Link</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    value={allimages[rows * 3].url}
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
          );
        } else if (length % 3 == 2) {
          result.push(
            <Row>
              <Col xs={6}>
                <Image
                  src={allimages[rows * 3].url}
                  alt={allimages[rows * 3].id}
                  fluid
                  className={Styles.imgHeight}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Link</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    value={allimages[rows * 3].url}
                    readOnly
                  />
                </InputGroup>
              </Col>
              <Col xs={6}>
                <Image
                  src={allimages[rows * 3 + 1].url}
                  alt={allimages[rows * 3 + 1].id}
                  fluid
                  className={Styles.imgHeight}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Link</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    value={allimages[rows * 3 + 1].url}
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
          );
        }
        setshowimage(result);
      }
    });
  };

  var getBlogs = () => {
    Axios.get("http://localhost:9000/save/blogs").then((res) => {
      if (res.data.loggedIn == false) {
        props.history.push("/");
        return;
      }
      var myblogs = res.data.data;
      var result = [];
      var rows = myblogs.title.length;
      for (var i = 0; i < rows; i++) {
        var parseddata = parseblog.parse(myblogs.content[i]);
        var url = "/myblog/" + myblogs.slug[i];
        var src =
          "https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20";
        myblogs.content[i].blocks.forEach((element) => {
          if (element.type == "imageurl") {
            src = element.data.url;
            return;
          }
        });
        var date = new Date(myblogs.pubdate[i]);
        date = date.toDateString();
        var text = [];
        if (myblogs.status[i] == false) {
          text.push(
            <div>
              <span className="text-warning mr-2">Status : Pending</span>
              <span>{date}</span>
            </div>
          );
        }
        else
        {
          text.push(
            <div>
              <span className="text-success mr-2">Status : Published</span>
              <span>{date}</span>
            </div>
          );
        }
        result.push(
          <a href={url} key={uuid()}>
            <Container style={{ marginTop: "5%", marginBottom: "5%" }}>
              <Media style={{ margin: "0% 3%" }}>
                <img
                  width={190}
                  height={120}
                  className="mr-3"
                  src={src}
                  alt={myblogs.title[i]}
                />
                <Media.Body className={Styles.fixedm}>
                  {text}
                  <h4 className="text-bold">{myblogs.title[i]}</h4>
                  <p>{parseddata}</p>
                </Media.Body>
              </Media>
            </Container>
          </a>
        );
      }
      setshowblogs(result);
    });
  };
  return (
    <div>
      <NavBar />
      {message == "" ? (
        <div></div>
      ) : (
        <Alert className={Styles.editorAlert} variant="danger">
          {message}
        </Alert>
      )}
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col xs={2}>
            <ListGroup>
              <ListGroup.Item action href="#link1">
                Write Blogs
              </ListGroup.Item>
              <ListGroup.Item href="#link2">My Images</ListGroup.Item>
              <ListGroup.Item href="#link3">My Blogs</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col xs={10}>
            <Tab.Content className="mx-5 my-5">
              <Tab.Pane eventKey="#link1">
                <Row>
                  <Col xs={9}>
                    <Card>
                      <Card.Header
                        style={{ backgroundColor: "#0a1f44", margin: "3% 7%" }}
                        className="text-center"
                      >
                        Write Your Story
                      </Card.Header>
                      <Card.Body
                        className={Styles.fixed}
                        id="editorjs"
                      ></Card.Body>
                    </Card>
                  </Col>
                  <Col xs={3}>
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
                            onChange={setselectCategories}
                            options={categories}
                            placeholder="Choose several states..."
                            selected={selectCategories}
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
                            onChange={setselectTags}
                            options={tags}
                            placeholder="Choose several states..."
                            selected={selectTags}
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                    <Card className="ml-3 mt-3 mr-1">
                      <Card.Body>
                        <Button onClick={submit} variant="info" size="md" block>
                          Submit For Review
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content className="mx-5 my-5">
              <Tab.Pane eventKey="#link2">
                <Card className={Styles.contain}>
                  <Card.Header className="text-center">
                    <h5>Uploaded Images</h5>
                  </Card.Header>
                  <Card.Body className={Styles.images}>{showimage}</Card.Body>
                  <Card.Footer className={Styles.updFiles}>
                    {filemessage == "" ? (
                      <div></div>
                    ) : (
                      <Alert variant="danger">{filemessage}</Alert>
                    )}
                    <Row>
                      <Col xs={4}>
                        <Form>
                          <Form.File
                            id="image"
                            label="Custom file input"
                            custom
                            onChange={fileChange}
                          />
                        </Form>
                      </Col>
                      <Col xs={3}>
                        <Button variant="info" onClick={upload} size="sm" block>
                          Upload
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content className="mx-5 my-5">
              <Tab.Pane eventKey="#link3">
                <Container>{showblogs}</Container>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
export default withRouter(Editor);
