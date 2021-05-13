import React, { useState, useEffect, createRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Axios from "axios";

import { Button, Card } from "react-bootstrap";
import parse, { Comment } from "html-react-parser";
import Styles from "../css/editor.module.css";
import uuid from "react-uuid";
export default class Tinymce extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = createRef(null);
    Axios.defaults.withCredentials = true;
    this.state = {
      comments: [],
      authorId: this.props.author,
      blogId: this.props.id,
      blogStatus: this.props.status,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ authorId: this.props.author });
      this.setState({ blogId: this.props.id });
      this.setState({ blogStatus: this.props.status });
      this.fetchComments();
    }, 1000);
  }
  log = () => {
    if (this.editorRef.current) {
      var content = this.editorRef.current.getContent();
      Axios.post("http://localhost:9000/user/query", {
        content: content,
        blogId: this.state.authorId,
        authorId: this.state.blogId,
      }).then((res) => {
        if (res.data.success == true) {
          this.fetchComments();
        }
      });
    }
  };
  delete = (id) => {
    Axios.post("http://localhost:9000/user/delquery", {
      id: id.id,
    }).then((res) => {
      this.fetchComments();
    });
  };
  fetchComments = () => {
    Axios.post("http://localhost:9000/user/getquery", {
      blogId: this.state.authorId,
      authorId: this.state.blogId,
    }).then((res) => {
      if (res.data.success == true) {
        var data = res.data.result;
        var comment = [];
        data.forEach((element) => {
          var html = parse(element.comment);
          var id = element.id;
          var add = [];
          if (element.sender == "admin") {
            add.push(
              <div
                key={uuid()}
                style={{ width: "100%", float: "right", marginTop: "4%" }}
              >
                <Card style={{ width: "50%", float: "left" }}>
                  <Card.Header className="text-center">
                    {element.updatedAt.split("T")[0]}
                  </Card.Header>
                  <Card.Body style={{ float: "left", borderRadius: "50%" }}>
                    {html}
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm" onClick={() => this.delete({ id })}>
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            );
          } else {
            add.push(
              <div
                key={uuid()}
                style={{ width: "100%", float: "right", marginTop: "4%" }}
              >
                <Card style={{ width: "50%", float: "right" }}>
                  <Card.Header className="text-center">
                    {element.updatedAt.split("T")[0]}
                  </Card.Header>
                  <Card.Body style={{ float: "left", borderRadius: "50%" }}>
                    {html}
                  </Card.Body>
                </Card>
              </div>
            );
          }
          comment.push(add);
        });
        this.setState({ comments: comment });
      }
    });
  };
  render() {
    return (
      <Card>
        <Card.Header
          style={{ backgroundColor: "#0a1f44", margin: "3% 7%" }}
          className="text-center"
        >
          Queries
        </Card.Header>
        <Card.Body className={Styles.fixe}>
          {this.state.comments.length > 0 ?(<div>{this.state.comments}</div>):(<p class="text-center">No Queries</p>)}
        </Card.Body>

        {this.state.blogStatus == true ? (
          <div></div>
        ) : (
          <div>
            <Card.Footer style={{ height: "220px" }}>
              <Editor
                apiKey="5lr84ueil4vrg3bvkgp237ymrxak5l5ynwb89j3ay2r4u3qy"
                onInit={(evt, editor) => (this.editorRef.current = editor)}
                initialValue=""
                init={{
                  height: 150,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
              <Button onClick={this.log} variant="info" className="mt-2">
                Add
              </Button>
            </Card.Footer>
          </div>
        )}
      </Card>
    );
  }
}
