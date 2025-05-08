import React, { useState } from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const GenderCard = ({ onPrev, onNext, onDataUpdate }) => {
  // Инициализируем состояние для выбранного пола
  const [selectedGender, setSelectedGender] = useState("");
  const [error, setError] = useState("");

  // Функция для обработки выбора из выпадающего меню
  const handleChange = (e) => {
    setSelectedGender(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  // Функция для проверки перед переходом
  const handleNavigation = (callback) => {
    if (selectedGender !== "male" && selectedGender !== "female") {
      setError("Выберите Ваш пол*");
    } else {
      setError("");
      onDataUpdate({gender: selectedGender });
      callback();
    }
  };

  return(
    <div className="questionnaire-cards">
        <img className="vectorPrevCard" alt="Vector" src={vectorPrev} onClick={onPrev}/>

        <img className="vectorNextCard" alt="Vector" src={vectorNext} onClick={() => handleNavigation(onNext)}/>

        <p className="textCard">
          <span className="text-wrapper-card">
            Выбери <br /> свой 
          </span>

          <span className="text-wrapper-card-2"> пол</span>

          <span className="text-wrapper-card">!</span>
        </p>
        
        {/* Блок с выпадающим меню */}
        <div className="gender-dropdown" style={{ marginTop: "20px", textAlign: "center" }}>
          <select value={selectedGender} onChange={handleChange}>
            {/* Значение пустое по умолчанию и заблокировано для выбора */}
            <option value="" disabled>
              Выбрать
            </option>
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
          </select>
           {/* Отображение сообщения об ошибке, если пол не выбран */}
           {error && <p className="error-message">{error}</p>}
        </div>
    </div>
  );
};