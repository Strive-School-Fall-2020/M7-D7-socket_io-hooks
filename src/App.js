import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import io from "socket.io-client";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";

const connOpt = {
  transports: ["websocket", "polling"],
};

let socket = io("https://striveschool.herokuapp.com/", connOpt);

function App() {
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    socket.on("bmsg", (msg) => setMessages((messages) => messages.concat(msg)));

    socket.on("connect", () => console.log("connected to socket"));
  }, []);

  const handleMessage = (e) => {
    setMessage(e.currentTarget.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("bmsg", {
        user: username,
        message: message,
      });

      setMessage("");
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className="App">
        <ul id="messages">
          {messages.map((msg, i) => (
            <li
              key={i}
              className={msg.user === username ? "ownMessage" : "message"}
            >
              <strong>{msg.user}</strong> {msg.message}
            </li>
          ))}
        </ul>
        <form id="chat" onSubmit={sendMessage}>
          <input autoComplete="off" value={message} onChange={handleMessage} />
          <Button type="submit" className="rounded-0">
            Send
          </Button>
        </form>
      </div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={toggleModal}
      >
        <Modal.Header>
          <Modal.Title>Set username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              onChange={(e) => setUsername(e.currentTarget.value)}
            ></FormControl>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={toggleModal}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
