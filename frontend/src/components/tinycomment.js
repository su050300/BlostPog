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
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ authorId: this.props.author });
      this.setState({ blogId: this.props.id });
      this.fetchComments();
    }, 1000);
  }
  log = () => {
    if (this.editorRef.current) {
      var content = this.editorRef.current.getContent();
      Axios.post("http://localhost:9000/comment/add", {
        content: content,
        blogId: this.state.blogId,
        authorId: this.state.authorId,
      }).then((res) => {
        if (res.data.loggedIn == false) {
          this.props.history.push("/");
          return;
        }
        if (res.data.success == true) {
          this.fetchComments();
        }
      });
    }
  };
  delete = (id) => {
    Axios.post("http://localhost:9000/comment/delete", {
      id: id.id,
    }).then((res) => {
      if (res.data.loggedIn == false) {
        this.props.history.push("/");
        return;
      }
      this.fetchComments();
    });
  };
  fetchComments = () => {
    Axios.post("http://localhost:9000/comment/getComments", {
      blogId: this.state.blogId,
    }).then((res) => {
      if (res.data.success == true) {
        var data = res.data.result;
        var comment = [];
        data.forEach((element) => {
          var data = parse(element.comment);
          var date = new Date(element.updatedAt);
          date = date.toDateString();
          var user =
            element.profileComment.first_name +
            " " +
            element.profileComment.last_name;
          var avatar = element.profileComment.avatar;
          comment.push(
            <div key={uuid()} className="px-2 py-2">
              <a href="#" style={{fontSize:"0.8rem"}}>
                <img
                  width={30}
                  height={30}
                  className="mr-3"
                  src={avatar}
                  alt={user}
                />
                <span className="mx-2">{user}</span><span className="mx-2">{date}</span>
              </a>

              <p className="my-2">{data}</p>
              <hr width="100%" className="my-1" color="rgba(9, 29, 66, 0.6)"></hr>
            </div>
          );
        });
        this.setState({ comments: comment });
        console.log(comment);
      }
    });
  };
  render() {
    return (
      <div style={{ width: "100%" }}>
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
          comment
        </Button>
        <hr width="100%" className="my-3" color="rgba(9, 29, 66, 0.6)"></hr>
        <div className="comments">{this.state.comments}</div>
      </div>
    );
  }
}
