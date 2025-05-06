import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const HeightCard = ({ onPrev, onNext }) => {
  // Состояния для хранения роста и сообщения об ошибке
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");

  // Обработчик изменения значения в поле ввода
  const handleChange = (e) => {
    setHeight(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  // Функция валидации и перехода на следующую карточку
  const handleNext = () => {
    // Проверка, что поле не пустое
    if (!height.trim()) {
      setError("Пожалуйста, введите ваш рост*");
      return;
    }
    // Проверка, что введено корректное число (например, 175 или 175.5)
    const validNumberRegex = /^\d+(\.\d+)?$/;
    if (!validNumberRegex.test(height) || height.trim() === "0") {
      setError("Введите корректное число*");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="questionnaire-cards">
      <img
        className="vectorPrevCard"
        alt="Vector"
        src={vectorPrev}
        onClick={onPrev}
      />

      <img
        className="vectorNextCard"
        alt="Vector"
        src={vectorNext}
        onClick={handleNext}
      />

      <p className="textCard">
        <span className="text-wrapper-card">
          Введи свой <br />
        </span>

        <span className="text-wrapper-card-2">рост</span>

        <span className="text-wrapper-card">!</span>
      </p>

      {/* Группа для поля ввода роста и единицы измерения "см" */}
      <div className="height-input-wrapper">
        <input
          type="text"
          value={height}
          onChange={handleChange}
          placeholder="Рост"
        />
        <span className="height-unit-text">см</span>
      </div>

      {/* Вывод сообщения об ошибке */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HeightCard;
