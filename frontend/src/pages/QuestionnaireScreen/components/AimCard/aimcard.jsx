import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const AimCard = ({ onPrev, onNext, onDataUpdate }) => {
  // Состояние для выбранной цели и сообщения об ошибке
  const [selectedAim, setSelectedAim] = useState("");
  const [error, setError] = useState("");

  // Обработчик изменения значения выпадающего списка
  const handleChange = (e) => {
    setSelectedAim(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  // Функция для проверки, что выбран один из вариантов
  const handleNavigation = (callback) => {
    if (
      selectedAim !== "MAINTAIN" &&
      selectedAim !== "LOSE" &&
      selectedAim !== "GAIN"
    ) {
      setError("Выберите одну из целей*");
    } else {
      setError("");
      onDataUpdate({goal:selectedAim});
      callback();
    }
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
        onClick={() => handleNavigation(onNext)}
      />

      <p className="textCard">
        <span className="text-wrapper-card">
          Какая у тебя <br />
        </span>
        <span className="text-wrapper-card-2">цель</span>
        <span className="text-wrapper-card">?</span>
      </p>

      {/* Выпадающее меню для выбора цели */}
      <div className="aim-dropdown">
        <select value={selectedAim} onChange={handleChange}>
          <option value="" disabled>
            Выбрать
          </option>
          <option value="LOSE">Потеря веса</option>
          <option value="MAINTAIN">Поддержание веса</option>
          <option value="GAIN">Набор веса</option>
        </select>
      </div>

      {/* Вывод сообщения об ошибке */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AimCard;
