import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import menu from "./src/menu.svg";
import vector from "./src/vector.svg";
import vectorPrev from "./src/vector-prev.svg";
import vectorAI from "./src/vector-ai.svg";
import "./chatscreenstyle.css";
import axios from 'axios';

export const ChatScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const backgroundSuffixes = ["", "2", "3", "4", "5"];

  // Состояния для поля ввода и списка сообщений  
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const textAreaRef = useRef(null);
  const messagesRef = useRef(null);

  const handleBack = () => {
    navigate(-1);
  };

  // Автоматическое изменение высоты текстового поля (до 5 строк — максимум ~120px)
  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      const maxHeight = 80; // например, 24px * 5 строк = 120px
      textAreaRef.current.style.height =
        Math.min(textAreaRef.current.scrollHeight, maxHeight) + "px";
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustTextAreaHeight();
  };

  // Отправка сообщения: добавляем новое сообщение и очищаем поле ввода  
  const handleSend = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    try {
      setIsLoading(true);

      // Добавляем сообщение пользователя
      const userMessage = {
        id: Date.now(),
        text: inputValue,
        sender: "user"
      };
      setMessages((prev) => [...prev, userMessage]);

      // Отправка запроса на бэкенд
      const response = await axios.post(
          "/api/chat",
          { message: inputValue },
          { withCredentials: true } // Для передачи кук аутентификации
      );

      // Получаем ответ от бэкенда
      const assistantMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "assistant"
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Ошибка:", error);
      // Добавьте обработку ошибки (например, уведомление)
    } finally {
      setIsLoading(false);
      setInputValue("");
      if (textAreaRef.current) textAreaRef.current.style.height = "auto";
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // При выборе темы из выпадающего меню:
  // закрываем меню и добавляем сообщение с выбранным текстом
  const handleSelectTopic = (topic) => {
    setDropdownOpen(false);
    const userMessage = {
      id: Date.now(),
      text: topic,
      sender: "user"
    };
    setMessages((prev) => [...prev, userMessage]);
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    // Автоматический ответ ассистента через 500мс
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        text: "Ответ от ии-ассистента",
        sender: "assistant"
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 500);
  };
  

  return (
    <div className="chatscreen">
      {/* Фоны с градиентами, сгенерированные через map */}
      {backgroundSuffixes.map((suffix, index) => (
        <div key={index} className={`background-colors${suffix}`}>
          <div className="blue-gradient" />
          <div className="red-gradient" />
          <div className="pirple-gradient" />
          <div className="yellow-gradient" />
          <div className="green-gradient" />
          <div className="yellow-gradient2" />
          <div className="green-gradient2" />
        </div>
      ))}

      <div className="header">
        <img
          className="vector-prev"
          src={vectorPrev}
          alt="Back"
          onClick={handleBack}
        />
        <div className="header-title">ИИ-помощник</div>
        <img className="vector-ai" src={vectorAI} alt="Vector AI" />
      </div>

      {/* Основной чат-контейнер */}
      <div className="chat-container">
        {/* Здесь выводятся сообщения — контейнер с overflow-y */}
        <div className="messages-container" ref={messagesRef}>
          {messages.map((message) => (
            <div key={message.id} className={message.sender === "assistant" ? "assistant-bubble" : "message-bubble"}>
              {message.text}
            </div>
          ))}
        </div>

        {/* Поле ввода и кнопка отправки */}
        <div className="input-area">
          {/* Кнопка дропдауна – находится слева от текстового поля */}
          <div className="dropdown-wrapper">
            <img
              className="vector"
              alt="Open topics"
              src={menu}
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() =>
                    handleSelectTopic("Давай поговорим о моём питании")
                  }
                >
                  Давай поговорим о моём питании
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    handleSelectTopic("Давай поговорим о моём сне")
                  }
                >
                  Давай поговорим о моём сне
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    handleSelectTopic(
                      "Давай поговорим о моей физической активности"
                    )
                  }
                >
                  Давай поговорим о моей физической активности
                </div>
                <div
                  className="dropdown-item"
                  onClick={() =>
                    handleSelectTopic("Давай поговорим о моём водном балансе")
                  }
                >
                  Давай поговорим о моём водном балансе
                </div>
              </div>
            )}
          </div>

          <textarea
            ref={textAreaRef}
            className="message-input"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Напишите сообщение"
            // Задаём maxHeight и динамический overflow (textarea сама будет растягиваться до maxHeight)
            style={{
              maxHeight: "120px",
              overflowY:
                textAreaRef.current &&
                textAreaRef.current.scrollHeight > 120
                  ? "auto"
                  : "hidden",
            }}
          />
          <img
            className="send-icon"
            alt="Send"
            src={vector}
            onClick={handleSend}
          />

        </div>
      </div>

      {/* Меню, прикреплённое внизу 
      <div className="menu-container">
        <MenuGroup
          onMenuClickAccount={handleMenuClick4}
          onMenuClickSleep={handleMenuClick5}
          onMenuClickMain={handleMenuClick}
          onMenuClickStatistic={handleMenuClick2}
          onMenuClickChat={handleMenuClick3}
        />
      </div>
      */}
    </div>
  );
};
