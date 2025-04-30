import React from "react";
import "./messageuserstyle.css";

const MessageUser = ({ text, sender = "user" }) => {
    const bubbleClass = sender === "assistant" ? "assistant-bubble" : "message-bubble";
    return (
    <div className={bubbleClass}>{text}</div>
    );
  };
  

export default MessageUser;
