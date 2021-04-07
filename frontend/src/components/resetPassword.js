/* eslint-disable */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import Axios from "axios";
import { Redirect, useParams, withRouter } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Card } from "react-bootstrap";
function ResetPassword(props) {
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [status, setstatus] = useState("");
  const [success, setsuccess] = useState(false);
  const id = useParams().id;
  Axios.defaults.withCredentials = true;
  var handleSubmit = (event) => {
    event.preventDefault();
    if (password == confirmPassword) {
      Axios.post("http://localhost:9000/changepass", {
        id: id,
        password: password,
      }).then((res) => {
        if (res.data.success == true) {
          setsuccess(true);
          setTimeout(() => {
            props.history.push("/");
          }, 5000);
        } else {
          setstatus("res.data.message");
        }
      });
    } else {
      setstatus("Password not matching");
    }
  };
  var handle = (event) => {
    var field = event.target.name;
    var value = event.target.value;
    if (field == "password") {
      setpassword(value);
    } else {
      setconfirmPassword(value);
    }
  };
  var style = {
    row: {
      marginTop: "25%",
    },
  };
  return (
    <Container>
      <Row className="justify-content-center" style={style.row}>
        <Card>
          <Card.Body>
            {success == true ? (<Form onSubmit={handleSubmit}>
              {status == "" ? (
                <div></div>
              ) : (
                <Alert variant="danger">{status}</Alert>
              )}
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handle}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  onChange={handle}
                  placeholder="Enter password again"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                submit
              </Button>
            </Form>):(<p>Password has been reset</p>)}
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}
export default withRouter(ResetPassword);
