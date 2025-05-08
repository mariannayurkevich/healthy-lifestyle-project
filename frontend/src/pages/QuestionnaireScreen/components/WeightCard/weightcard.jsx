import React, {useEffect, useState} from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const WeightCard = ({ onPrev, onNext, onDataUpdate }) => {
  // Состояние для хранения веса и сообщения об ошибке
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  // Обработчик изменения поля ввода
  const handleChange = (e) => {
    setWeight(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  // Функция для проверки корректности ввода веса и перехода к следующей карточке
  const handleNext = () => {
    // Проверка на пустое значение
    if (!weight.trim()) {
      setError("Пожалуйста, введите ваш вес*");
      return;
    }
    // Проверка, что введено корректное число (целое или с плавающей точкой)
    const validNumberRegex = /^\d+(\.\d+)?$/;
    if (!validNumberRegex.test(weight) || weight.trim() === "0") {
      setError("Введите корректное число*");
      return;
    }
    setError("");
    onDataUpdate({ weight:weight }); // Передаем данные в родительский компонент
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
          Сколько ты <br />
        </span>
        <span className="text-wrapper-card-2"> весишь</span>
        <span className="text-wrapper-card">?</span>
      </p>

      {/* Группа для поля ввода веса и единицы измерения "кг", позиционируется по центру */}
      <div className="weight-input-wrapper">
        <input
          type="text"
          value={weight}
          onChange={handleChange}
          placeholder="Вес"
        />
        
        <span className="weight-unit-text">кг</span>

        {/* Вывод сообщения об ошибке */}
        {error && <p className="error-message">{error}</p>}
      </div>
      
    </div>
  );
};

export default WeightCard;
