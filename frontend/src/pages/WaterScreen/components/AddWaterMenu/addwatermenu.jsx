import React from "react";
import "../../../QuestionnaireScreen/questionnairescreenstyle.css";
import "../../waterscreenstyle.css";

export const AddWaterMenu = ({ onClose }) => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD, который требуется для input type="date"
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="add-water-menu">
      <div className="add-water-menu-cards-container">
        <div className="add-water-menu-cards">

          {/* Поле для даты приема */}
          <div className="input-group date-group">
            <label htmlFor="date-input" className="input-label">
              Дата приема <br />
            </label>
            <input
              type="date"
              id="date-input"
              className="input-field"
              defaultValue={today}  // Используем сегодняшую дату по умолчанию
            />
          </div>

          {/* Поле для количества воды */}
          <div className="input-group water-group">
            <label htmlFor="water-input" className="input-label">
              Количество выпитой воды
            </label>
            <div className="input-with-unit">
              <input
                type="number"
                id="water-input"
                placeholder="мл"
                className="input-field"
              />
              <span className="unit-label">мл</span>
            </div>
          </div>

          <div className="button-save" onClick={onClose}>
          <div className="div-wrapper-save">
            <div className="text-wrapper-22">Сохранить</div>
          </div>
        </div>

        </div>

        

      </div>
    </div>
  );
};
