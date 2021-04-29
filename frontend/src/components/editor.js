/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
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
import LinkEditor from "@editorjs/link";
import ParagraphEditor from "@editorjs/paragraph";
import InlineEditor from "@editorjs/inline-code";
import TableEditor from "@editorjs/table";
import MarkerEditor from "@editorjs/marker";

import NavBar from "./navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import Styles from "../css/editor.module.css";
import "../css/global.css";
import "react-pro-sidebar/dist/css/styles.css";

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
};
var editor = new EditorJS({
  holder: "editorjs",
  autofocus: true,
  tools: tool,
  data: {},
  minHeight: 450,
  onReady: () => {
    if(editor)
    {
      editor.destroy();
      editor = new EditorJS({
        holder:"editorjs",
        autofocus:true,
        tools:tool,
        data:{},
        minHeight:450,
      })
    }
    console.log("Editor is ready");
  },
  onChange: (api) => {},
});
function Editor() {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editorInstance, seteditorInstance] = useState(false);
  const [selectTags, setselectTags] = useState([]);
  const [selectCategories, setselectCategories] = useState([]);
  const [flag, setflag] = useState(1);
  const [message, setmessage] = useState("");
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    getTags();
    getCategories();
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
          console.log(outputData);
        }
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };
  return (
    <div>
      <NavBar />
      {message == "" ? <div></div> : <Alert variant="danger">{message}</Alert>}
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col xs={2}>
            <ListGroup>
              <ListGroup.Item action href="#link1" disabled>
                Write Story
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col xs={7}>
            <Tab.Content className="mx-5 my-5">
              <Tab.Pane eventKey="#link1">
                <Card>
                  <Card.Header
                    style={{ backgroundColor: "#0a1f44", margin: "3% 15%" }}
                    className="text-center"
                  >
                    Write Your Story
                  </Card.Header>
                  <Card.Body id="editorjs"></Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
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
      </Tab.Container>
    </div>
  );
}
export default Editor;
