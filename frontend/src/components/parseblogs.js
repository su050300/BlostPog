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
  Image,
  InputGroup,
} from "react-bootstrap";
import parse from "html-react-parser";
import uuid from "react-uuid";
var parseContent = (content) => {
  return parse(content);
};

export const parseblog = {
  table: (content) => {
    var table = [];
    var rows = content.length;
    var columns = content[0].length;
    var headingdata = [];
    var headingrow = [];
    for (var i = 0; i < columns; i++) {
      headingdata.push(<th key={uuid()}>{parseContent(content[0][i])}</th>);
    }
    headingrow.push(
      <thead key={uuid()}>
        <tr key={uuid()}>{headingdata}</tr>
      </thead>
    );
    var tabledata = [];
    var tablebody = [];
    for (var i = 1; i < rows; i++) {
      var row = [];
      var rowdata = [];
      for (var j = 0; j < columns; j++) {
        rowdata.push(<td key={uuid()}>{parseContent(content[i][j])}</td>);
      }
      row.push(<tr key={uuid()}>{rowdata}</tr>);
      tabledata.push(row);
    }
    tablebody.push(<tbody key={uuid()}>{tabledata}</tbody>);
    table.push(
      <Table
        striped
        bordered
        hover
        variant="dark"
        key={uuid()}
        style={{ width: "100%" }}
      >
        {headingrow}
        {tablebody}
      </Table>
    );
    return table;
  },
  list: (content) => {
    if (content.style == "ordered") {
      var list = [];
      var listelement = [];
      var data = content.items;
      for (var i = 0; i < data.length; i++) {
        listelement.push(<li key={uuid()}>{data[i]}</li>);
      }
      list.push(
        <ol style={{ width: "100%" }} key={uuid()}>
          {listelement}
        </ol>
      );
      return list;
    } else {
      var list = [];
      var listelement = [];
      var data = content.items;
      for (var i = 0; i < data.length; i++) {
        listelement.push(<li key={uuid()}>{data[i]}</li>);
      }
      list.push(
        <ul style={{ width: "100%" }} key={uuid()}>
          {listelement}
        </ul>
      );
      return list;
    }
  },
  code: (content) => {
    return (
      <pre style={{ width: "100%" }} className="prettyprint codes" key={uuid()}>
        {content.code}
      </pre>
    );
  },
  quote: (content) => {
    var data = parseContent(content.data.text);
    var caption = parseContent(content.data.caption);
    if (content.data.alignment == "left") {
      return (
        <blockquote
          style={{ width: "100%" }}
          key={uuid()}
          className="blockquote text-left"
        >
          <p className="mb-0">{data}</p>
          <footer className="blockquote-footer">{caption}</footer>
        </blockquote>
      );
    } else {
      return (
        <blockquote
          style={{ width: "100%" }}
          key={uuid()}
          className="blockquote text-center"
        >
          <p className="mb-0">{data}</p>
          <footer className="blockquote-footer">{caption}</footer>
        </blockquote>
      );
    }
  },
  image: (content) => {
    var caption = parseContent(content.data.caption);
    return (
      <blockquote
        style={{ width: "100%" }}
        key={uuid()}
        className="blockquote text-center"
      >
        <Image
          src={content.data.url}
          style={{ width: "100%", hight: "400px" }}
          fluid
          key={uuid()}
        />
        <footer className="blockquote-footer">{caption}</footer>
      </blockquote>
    );
  },
  header: (content) => {
    var type = content.data.level;
    var data = parseContent(content.data.text);
    switch (type) {
      case 1:
        return <h1 key={uuid()}>{data}</h1>;
      case 2:
        return <h2 key={uuid()}>{data}</h2>;
      case 3:
        return <h3 key={uuid()}>{data}</h3>;
      case 4:
        return <h4 key={uuid()}>{data}</h4>;
      case 5:
        return <h5 key={uuid()}>{data}</h5>;
      case 6:
        return <h6 key={uuid()}>{data}</h6>;
    }
  },
  html: (content) => {
    return (
      <pre
        style={{ width: "100%" }}
        className="prettyprint codes lang-html"
        key={uuid()}
      >
        {content.data.html}
      </pre>
    );
  },
  parse : (content) => {
    var data = content.blocks;
    var objects = data.length;
    var res = [];
    for (var i = 0; i < objects; i++) {
      var element = data[i];
      switch (element.type) {
        case "table":
          var result = parseblog.table(element.data.content);
          res.push(result);
          break;
        case "list":
          var result = parseblog.list(element.data);
          res.push(result);
          break;
        case "code":
          var result = parseblog.code(element.data);
          res.push(result);
          break;
        case "quote":
          var result = parseblog.quote(element);
          res.push(result);
          break;
        case "imageurl":
          var result = parseblog.image(element);
          res.push(result);
          break;
        case "header":
          var result = parseblog.header(element);
          res.push(result);
          break;
        case "raw":
          var result = parseblog.html(element);
          res.push(result);
          break;
      }
    }
    return res;
  },
};
