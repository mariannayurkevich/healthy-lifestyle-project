import React, { useState } from "react";
import bubble from "../../src/bubble.svg";
import bubble2 from "../../src/bubble2.svg";
import bubble3 from "../../src/bubble3.svg";
import bubble4 from "../../src/bubble4.svg";
import "../../waterscreenstyle.css";

export const AddWaterMenu = ({ onClose }) => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD, который требуется для input type="date"
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [amountMl, setAmountMl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Валидация
    if (!date || !amountMl || parseFloat(amountMl) <= 0) {
      alert("Пожалуйста, заполните все поля корректно. Количество воды должно быть больше 0.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Пользователь не авторизован");

      const now = new Date();
      const fullDateTime = new Date(`${date}T${now.toTimeString().slice(0, 8)}`);

      const entry = {
        time: fullDateTime.toISOString(),
        amountMl: parseFloat(amountMl)
      };

      const waterData = {
        date: date,
        goalMl: 2000,
        entries: [entry],
        createdAt: fullDateTime.toISOString(),
        updatedAt: fullDateTime.toISOString()
      };

      const response = await fetch(`/api/water?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waterData),
        credentials: "include"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сохранения: ${response.status} - ${errorText}`);
      }

      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Ошибка:", err);
      alert(`Не удалось сохранить запись о воде: ${err.message}`);
    }
  };

  return (
      <div className="add-water-menu">
        <div className="add-water-menu-cards-container">
          <img className="bubble" src={bubble} alt="Пузырь" />
          <img className="bubble2" src={bubble2} alt="Пузырь" />
          <img className="bubble3" src={bubble3} alt="Пузырь" />
          <img className="bubble4" src={bubble4} alt="Пузырь" />
          <img className="bubble5" src={bubble2} alt="Пузырь" />
          <img className="bubble6" src={bubble3} alt="Пузырь" />

          <div className="add-water-menu-cards">
            <form className="water-data-form" onSubmit={handleSubmit}>
              {/* Поле для даты приема */}
              <div className="input-group date-group">
                <label htmlFor="date-input" className="input-label">
                  Дата приема <br />
                </label>
                <input
                    type="date"
                    id="date-input"
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
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
                      value={amountMl}
                      onChange={(e) => setAmountMl(e.target.value)}
                      min="1"
                      step="1"
                      required
                  />
                  <span className="unit-label">мл</span>
                </div>
              </div>

              {/* Кнопки в одной строке */}
              <div className="form-actions-row">
                <button
                    type="button"
                    className="button-cancel"
                    onClick={onClose}
                >
                  Отмена
                </button>
                <button
                    type="submit"
                    className="button-save"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};