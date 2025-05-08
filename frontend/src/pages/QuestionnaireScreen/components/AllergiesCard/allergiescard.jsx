import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const AllergiesCard = ({ onPrev, onNext, onDataUpdate}) => {
  const [allergy, setAllergy] = useState("");
    const [error, setError] = useState("");

    // Обработчик изменения поля ввода
    const handleChange = (e) => {
        setAllergy(e.target.value);
        if (e.target.value) {
            setError("");
        }
    };

    // Функция для проверки корректности ввода веса и перехода к следующей карточке
    const handleNext = () => {
        // Проверка на пустое значение
        if (!allergy.trim()) {
            setError("Пожалуйста, введите ваши аллергии");
            return;
        }
        setError("");
        onDataUpdate({ allergies:allergy }); // Передаем данные в родительский компонент
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

        <span className="text-wrapper-card-2">аллергии</span>

        <span className="text-wrapper-card">
          , <br /> напиши их!
        </span>
      </p>

      {/* Поле для ввода со множественными строками */}
      <div className="allergy-input-wrapper">
        <textarea
          value={allergy}
          onChange={handleChange}
          placeholder="Аллергия на ..."
          className="allergy-input"
          rows="4" /* Количество строк по умолчанию */
        />
      </div>
    </div>
  );
};

export default AllergiesCard;
