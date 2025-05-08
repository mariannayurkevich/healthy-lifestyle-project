import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const ActivityLevelCard = ({ onPrev, onNext,onDataUpdate }) => {
  // Состояние для выбранного уровня активности и сообщения об ошибке
  const [selectedActivity, setSelectedActivity] = useState("");
  const [error, setError] = useState("");

  // Обработчик выбора из выпадающего меню
  const handleChange = (e) => {
    setSelectedActivity(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  // Функция навигации с проверкой корректного выбора
  const handleNavigation = (callback) => {
    if (
      selectedActivity !== "sedentary" &&
      selectedActivity !== "light" &&
      selectedActivity !== "moderate" &&
      selectedActivity !== "active" &&
      selectedActivity !== "very_active"
    ) {
      setError("Выберите уровень активности");
    } else {
      setError("");
      onDataUpdate({activityLevel: selectedActivity});
      callback();
    }
  };

  return (
    <div className="questionnaire-cards">
      <img
        className="vectorPrevCard"
        alt="Vector"
        src={vectorPrev}
        onClick={() => handleNavigation(onPrev)}
      />

      <img
        className="vectorNextCard"
        alt="Vector"
        src={vectorNext}
        onClick={() => handleNavigation(onNext)}
      />

      <p className="textCard">
        <span className="text-wrapper-card">
          Выбери уровень <br />
        </span>
        <span className="text-wrapper-card-2">активности</span>
        <span className="text-wrapper-card">!</span>
      </p>

      {/* Выпадающее меню для выбора уровня активности */}
      <div className="activity-dropdown">
        <select value={selectedActivity} onChange={handleChange}>
          <option value="" disabled>
            Выбрать
          </option>
          <option value="sedentary">сидячий образ жизни</option>
          <option value="light">низкая физическая активность</option>
          <option value="moderate">умеренная физическая активность</option>
          <option value="active">интенсивная физическая активность</option>
          <option value="very_active">
            очень интенсивная физическая активность
          </option>
        </select>
      </div>

      {/* Вывод сообщения об ошибке */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ActivityLevelCard;
