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
import Image from "@editorjs/simple-image";
import Quote from "@editorjs/quote";

import NavBar from "./navbar";
function Editor() {
  Axios.defaults.withCredentials = true;
  const editor = new EditorJS({
    holder: "editorjs",
    tools: {
      header: {
        class: Header,
      },
      list: {
        class: List,
      },
      embed: {
        class: Embed,
      },
      raw: {
        class: Raw,
      },
      image: {
        class: Image,
      },
      quote: {
        class: Quote,
      },
    },
  });
  return (
    <div>
      <NavBar />
      <div class="editor">
        <Card>
          <Card.Header>Create Your Story</Card.Header>
          <Card.Body>
            <div id="editorjs"></div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
export default Editor;
