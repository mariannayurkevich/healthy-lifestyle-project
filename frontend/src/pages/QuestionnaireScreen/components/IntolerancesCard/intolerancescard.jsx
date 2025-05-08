import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const IntolerancesCard = ({ onPrev, onNext, onDataUpdate }) => {
  // Состояние для хранения введённых непереносимостей
  const [intolerance, setIntolerance] = useState("");
    const [error, setError] = useState("");

    // Обработчик изменения поля ввода
    const handleChange = (e) => {
        setIntolerance(e.target.value);
        if (e.target.value) {
            setError("");
        }
    };

    // Функция для проверки корректности ввода веса и перехода к следующей карточке
    const handleNext = () => {
        // Проверка на пустое значение
        if (!intolerance.trim()) {
            setError("Пожалуйста, введите ваши непереносимости");
            return;
        }
        setError("");
        onDataUpdate({ intolerances:intolerance }); // Передаем данные в родительский компонент
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
          Если есть <br />
        </span>

        <span className="text-wrapper-card-2">непереносимости</span>

        <span className="text-wrapper-card">
          , <br />
          напиши их!
        </span>
      </p>

      {/* Поле для ввода непереносимостей */}
      <div className="intolerance-input-wrapper">
        <textarea
          value={intolerance}
          onChange={handleChange}
          placeholder="Непереносимость ..."
          className="intolerance-input"
          rows="4"  /* Количество строк по умолчанию */
        />
      </div>
    </div>
  );
};

export default IntolerancesCard;
