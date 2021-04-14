/* eslint-disable */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/editor.css";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Raw from "@editorjs/raw";
import Image from "@editorjs/image";
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
    editor.save().then((outputData) => {
        console.log('Article data: ', outputData)
      }).catch((error) => {
        console.log('Saving failed: ', error)
      });
  };
  return (
    <div>
      <NavBar />
      <div className="edit">
        <Card>
          <Card.Header>
            <h4 className="text-center">Create Your Story</h4>
          </Card.Header>
          <Card.Body>
            <div id="editorjs"></div>
          </Card.Body>
          <Card.Footer className="text-center">
            <Button variant="info" onClick={submit}>
              Submit
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
export default Editor;
