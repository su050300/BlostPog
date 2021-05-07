/* eslint-disable */
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
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
import HeaderEditor from "@editorjs/header";
import ListEditor from "@editorjs/list";
import EmbedEditor from "@editorjs/embed";
import RawEditor from "@editorjs/raw";
import ImageEditor from "@editorjs/simple-image";
import QuoteEditor from "@editorjs/quote";
import CodeEditor from "@editorjs/code";
import UnderlineEditor from "@editorjs/underline";
import PersonalityEditor from "@editorjs/personality";
import ParagraphEditor from "@editorjs/paragraph";
import InlineEditor from "@editorjs/inline-code";
import TableEditor from "@editorjs/table";
import MarkerEditor from "@editorjs/marker";
import { parseblog } from "./parseblogs";
import uuid from "react-uuid";

import NavBar from "./navbar";
import { app } from "./default.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "../css/editor.module.css";
import "../css/global.css";
import "react-pro-sidebar/dist/css/styles.css";

class saveImage {
  constructor({ data, api }) {
    this.api = api;
    this.data = {
      url: data.url || "",
      caption: data.caption || "",
      withBorder: data.withBorder !== undefined ? data.withBorder : false,
      withBackground:
        data.withBackground !== undefined ? data.withBackground : false,
      stretched: data.stretched !== undefined ? data.stretched : false,
    };
    this.wrapper = undefined;
    this.settings = [
      {
        name: "withBorder",
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
      },
      {
        name: "stretched",
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`,
      },
      {
        name: "withBackground",
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`,
      },
    ];
  }

  static get toolbox() {
    return {
      title: "ImageUsingUrl",
      icon:
        '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  renderSettings() {
    const wrapper = document.createElement("div");

    this.settings.forEach((tune) => {
      let button = document.createElement("div");

      button.classList.add(this.api.styles.settingsButton);
      button.classList.toggle(
        this.api.styles.settingsButtonActive,
        this.data[tune.name]
      );
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);
      button.addEventListener("click", () => {
        this._toggleTune(tune.name);
        button.classList.toggle(this.api.styles.settingsButtonActive);
      });
    });

    return wrapper;
  }

  render() {
    this.wrapper = document.createElement("div");
    const input = document.createElement("input");

    if (this.data && this.data.url) {
      this._createImage(this.data.url, this.data.caption);
      return this.wrapper;
    }

    this.wrapper.classList.add("simple-image");
    this.wrapper.appendChild(input);

    input.placeholder = "Paste an image URL...";
    input.value = this.data && this.data.url ? this.data.url : "";
    input.addEventListener("paste", (event) => {
      this._createImage(event.clipboardData.getData("text"));
    });

    return this.wrapper;
  }

  _createImage(url, captionText) {
    const image = document.createElement("img");
    const caption = document.createElement("input");

    image.src = url;
    caption.placeholder = "Caption...";
    caption.value = captionText || "";

    this.wrapper.innerHTML = "";
    this.wrapper.appendChild(image);
    this.wrapper.appendChild(caption);

    this._acceptTuneView();
  }

  save(blockContent) {
    const image = blockContent.querySelector("img");
    const caption = blockContent.querySelector("input");

    return Object.assign(this.data, {
      url: image.src,
      caption: caption.value,
    });
  }

  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }
  _acceptTuneView() {
    this.settings.forEach((tune) => {
      this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);

      if (tune.name === "stretched") {
        this.api.blocks.stretchBlock(
          this.api.blocks.getCurrentBlockIndex(),
          !!this.data.stretched
        );
      }
    });
  }
}

var tool = {
  header: {
    class: HeaderEditor,
    inlineToolbar: true,
  },
  list: {
    class: ListEditor,
    inlineToolbar: true,
  },
  embed: {
    class: EmbedEditor,
    config: {
      services: {
        youtube: true,
        coub: true,
      },
    },
    inlineToolbar: true,
  },
  raw: {
    class: RawEditor,
    inlineToolbar: true,
  },
  image: {
    class: ImageEditor,
    inlineToolbar: true,
  },
  quote: {
    class: QuoteEditor,
    inlineToolbar: true,
  },
  code: {
    class: CodeEditor,
    inlineToolbar: true,
  },
  underline: {
    class: UnderlineEditor,
    inlineToolbar: true,
  },
  personality: {
    class: PersonalityEditor,
    inlineToolbar: true,
  },
  paragraph: {
    class: ParagraphEditor,
    inlineToolbar: true,
  },
  inline: {
    class: InlineEditor,
    inlineToolbar: true,
  },
  table: {
    class: TableEditor,
    inlineToolbar: true,
  },
  marker: {
    class: MarkerEditor,
    inlineToolbar: true,
  },
  imageurl: {
    class: saveImage,
    inlineToolbar: true,
  },
};
var editor = new EditorJS({
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
function Editor() {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectTags, setselectTags] = useState([]);
  const [selectCategories, setselectCategories] = useState([]);
  const [flag, setflag] = useState(1);
  const [message, setmessage] = useState("");
  const [file, setfile] = useState("");
  const [filemessage, setfilemessage] = useState("");
  const [showimage, setshowimage] = useState([]);
  const [showblogs, setshowblogs] = useState([]);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    getTags();
    getCategories();
    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js";
    script.async = true;

    document.body.appendChild(script);
    fetchImages(0);
    getBlogs(0);
    setflag(0);
  });

  var getTags = () => {
    if (flag) {
      Axios.get("http://localhost:9000/getTags").then((res) => {
        var result = res.data.tags;
        var length = result.length;
        var temp = [];
        for (var i = 0; i < length; i++) {
          temp.push(result[i][Object.keys(result[i])]);
        }
        setTags(temp);
      });
    }
  };
  var getCategories = () => {
    if (flag) {
      Axios.get("http://localhost:9000/getCategories").then((res) => {
        var result = res.data.categories;
        var length = result.length;
        var temp = [];
        for (var i = 0; i < length; i++) {
          temp.push(result[i][Object.keys(result[i])]);
        }
        setCategories(temp);
      });
    }
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
            getBlogs(1);
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
        console.log(res.data.message);
        fetchImages(1);
      });
    }
  };
  var fileChange = (e) => {
    const file = e.target.files[0];
    setfile(file);
  };
  var fetchImages = (fl) => {
    if (flag || fl) {
      Axios.get("http://localhost:9000/save/image").then((res) => {
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
    }
  };

  var getBlogs = (fl) => {
    if (flag || fl) {
      Axios.get("http://localhost:9000/save/blogs").then((res) => {
        var myblogs = res.data.data;
        var result = [];
        var rows = myblogs.title.length;
        for (var i = 0; i < rows; i++) {
          var parseddata = parseblog.parse(myblogs.content[i]);
          var url = "/blog/" + myblogs.slug[i];
          var src =
            "https://firebasestorage.googleapis.com/v0/b/blostpog.appspot.com/o/image%2Fdefault.png?alt=media&token=2ab563d9-f8f1-4619-ab63-af66ee54ce20";
          myblogs.content[i].blocks.forEach((element) => {
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
                    alt={myblogs.title[i]}
                  />
                  <Media.Body className={Styles.fixedm}>
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
    }
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
                Write Story
              </ListGroup.Item>
              <ListGroup.Item href="#link2">Your Images</ListGroup.Item>
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
export default Editor;
