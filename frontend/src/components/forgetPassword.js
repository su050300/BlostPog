/* eslint-disable */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import {Form,Button,Alert} from "react-bootstrap";
function ForgetPassword() {
  const [email, setemail] = useState("");
  const [status, setstatus] = useState("");
  Axios.defaults.withCredentials = true;
  var handle = (event) => {
    setemail(event.target.value);
  };
  var handleSubmit = (event) => {
    Axios.post("http://localhost:9000/reset",{
      email,
    }).then((res) => {
      if (res.data.isPresent == false) {
        setstatus(res.data.message);
      } else {
        return <Redirect to="/" />;
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit}>
      {status == ""?(<div></div>):(<Alert variant="danger">{status}</Alert>)}
      <Form.Group controlId="formBasicUser">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          onChange={handle}
          placeholder="Enter email"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        submit
      </Button>
    </Form>
  );
}
export default ForgetPassword;
