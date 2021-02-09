import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import io from "socket.io-client";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";

const connOpt = {
  transports: ["websocket"], // socket connectin options
};

let socket = io("https://striveschool.herokuapp.com/", connOpt); //socket instance

function App() {
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    socket.on("bmsg", (msg) => setMessages((messages) => messages.concat(msg)));
    //listening to any event of type "bmsg" and reacting by calling the function
    //that will append a new message to the "messages" array

    socket.on("connect", () => console.log("connected to socket")); //check if socket is connected

    return () => socket.removeAllListeners(); //componentWillUnmount
  }, []);

  const handleMessage = (e) => {
    setMessage(e.currentTarget.value); //saving the message text in the state
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (message !== "") {
      socket.emit("bmsg", {
        //emitting an event with a payload to send the message to all connected users
        user: username, //state.username
        message: message, //state.message
      });

      setMessage(""); //resets the message text
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className="App">
        <ul id="messages">
          {messages.map((
            msg,
            i //displays all new messages
          ) => (
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
