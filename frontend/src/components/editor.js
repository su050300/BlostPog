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
  Form,
  Button,
  Alert,
  Card,
  Row,
  FormControl,
  Col,
  Container,
} from "react-bootstrap";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Raw from "@editorjs/raw";
import Image from "@editorjs/simple-image";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Underline from "@editorjs/underline";
import Personality from "@editorjs/personality";
import Link from "@editorjs/link";
import Paragraph from "@editorjs/paragraph";
import Inline from "@editorjs/inline-code";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";

import NavBar from "./navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/editor.css";
import "react-pro-sidebar/dist/css/styles.css";

import { v4 as uuidv4 } from 'uuid';


function Editor() {
  Axios.defaults.withCredentials = true;
  var editor = new EditorJS({
    holder: "editorjs",
    autofocus: true,
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      embed: {
        class: Embed,
        inlineToolbar: true,
      },
      raw: {
        class: Raw,
        inlineToolbar: true,
      },
      image: {
        class: Image,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      code: {
        class: Code,
        inlineToolbar: true,
      },
      underline: {
        class: Underline,
        inlineToolbar: true,
      },
      personality: {
        class: Personality,
        inlineToolbar: true,
      },
      link: {
        class: Link,
        inlineToolbar: true,
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      inline: {
        class: Inline,
        inlineToolbar: true,
      },
      table: {
        class: Table,
        inlineToolbar: true,
      },
      marker: {
        class: Marker,
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
    //   logLevel: 5,

    /**
     * Enable read-only mode
     */
    //   readOnly: true,

    /**
     * Internalization config
     */
    //   i18n: I18nConfig;

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
        console.log("Article data: ", outputData);
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
  var addTag = () => {
    var value = document.getElementById("tags").value;
    var id = uuidv4();
    document.getElementById("container").innerHTML+=`<span class="mt-3 wrap"`+` id="`+id+`">`+value+`</span>`;
  }
  return (
    <div>
      <NavBar />
      <Row>
        <Col xs="2">
          <ProSidebar>
            <SidebarHeader className="mt-2 mb-2 py-3 px-3 whte">
              Hi username
            </SidebarHeader>
            <SidebarContent className="whte mt-2 mb-2">
              <Menu className="whte">
                <MenuItem>New Post</MenuItem>
                <MenuItem>My Posts</MenuItem>
              </Menu>
            </SidebarContent>
            <SidebarFooter className="margin-3 whte py-3 px-3">
              Hello
            </SidebarFooter>
          </ProSidebar>
        </Col>
        <Col xs="8" className="mt-5">
          <Card>
            <Card.Body>
              <div id="editorjs"></div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="2" className="mt-5">
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
              <div className="categories">
                <h5>Categories</h5>
                <Form>
                  <FormControl
                    type="text"
                    placeholder="Search categories"
                    className="mr-sm-2"
                    name="categories"
                  />
                </Form>
              </div>
            </Card.Body>
          </Card>
          <Card className="ml-3 mt-3 mr-1">
            <Card.Body>
              <div className="tags">
                <h5>Tags</h5>
                <Form>
                  <FormControl
                    type="text"
                    placeholder="Search tags"
                    className="mr-sm-2"
                    name="tags"
                    id="tags"
                  />
                  <Button onClick={addTag} className="mt-2" variant="secondary" size="sm">Add</Button>
                </Form>
                <div id="container">

                </div>
              </div>
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
    </div>
  );
}
export default Editor;
