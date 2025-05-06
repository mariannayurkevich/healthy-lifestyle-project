import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const ActivityLevelCard = ({ onPrev, onNext }) => {
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
      selectedActivity !== "сидячий образ жизни" &&
      selectedActivity !== "низкая физическая активность" &&
      selectedActivity !== "умеренная физическая активность" &&
      selectedActivity !== "интенсивная физическая активность" &&
      selectedActivity !== "очень интенсивная физическая активность"
    ) {
      setError("Выберите уровень активности");
    } else {
      setError("");
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
          <option value="сидячий образ жизни">сидячий образ жизни</option>
          <option value="низкая физическая активность">низкая физическая активность</option>
          <option value="умеренная физическая активность">умеренная физическая активность</option>
          <option value="интенсивная физическая активность">интенсивная физическая активность</option>
          <option value="очень интенсивная физическая активность">
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
