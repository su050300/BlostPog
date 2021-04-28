/* eslint-disable */
import React, { useState } from "react";
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

import { v4 as uuidv4 } from "uuid";

function Editor() {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editorInstance, seteditorInstance] = useState(false);
  const [selectTags, setselectTags] = useState([]);
  const [selectCatgeories, setselectCatgeories] = useState([]);
  Axios.defaults.withCredentials = true;
  var editor = new EditorJS({
    holder: "editorjs",
    autofocus: true,
    tools: {
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
      link: {
        class: LinkEditor,
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
    },
    /**
     * First Block placeholder
     */
    //   placeholder: "Get started",

    /**
     * Data to render on Editor start
     */
    data: {},

    /**
     * Height of Editor's bottom area that allows to set focus on the last Block
     */
    minHeight: 450,

    /**
     * Editors log level (how many logs you want to see)
     */
    // logLevel: 1,

    /**
     * Enable read-only mode
     */
    // readOnly: true,

    /**
     * Internalization config
     */
    // i18n: "I18nConfig",

    /**
     * Fires when Editor is ready to work
     */
    onReady: () => {
      console.log("Editor is ready");
    },

    /**
     * Fires when something changed in DOM
     */
    onChange: (api) => {
      console.log(api);
    },
  });
  var submit = () => {
    editor
      .save()
      .then((outputData) => {
        Axios.post("http://localhost:9000/save/blogs", {
          content: JSON.stringify(outputData),
          tags: "entertainment",
        }).then((res) => {
          console.log(res.data.message);
        });
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };
  return (
    <div>
      <NavBar />
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col xs={2}>
            <ListGroup>
              <ListGroup.Item action href="#link1" disabled>
                Write Story
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col xs={8}>
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
          <Col xs={2}>
            <Card className="ml-3 mr-1">
              <Card.Body>
                <div className="post-details">
                  <h5>Post Details</h5>
                  <Form>
                    <FormControl
                      type="text"
                      placeholder="title"
                      className="mr-sm-2"
                      name="title"
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
                    onChange={setselectCatgeories}
                    options={categories}
                    placeholder="Choose several states..."
                    selected={selectCatgeories}
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
                    onChange={selectTags}
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
