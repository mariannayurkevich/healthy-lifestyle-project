import React, {useState} from "react";
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

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId"); // предполагается, что ID трекера можно получить так
      if (!userId) throw new Error("User not authenticated");

      const now = new Date();
      const fullDateTime = new Date(`${date}T${now.toTimeString().slice(0, 8)}`);

      const entry = {
        time: fullDateTime.toISOString(),
        amountMl: parseFloat(amountMl)
      };

      const waterData = {
        date: date,
        goalMl: 2000, // можно передать значение цели, либо получить из локального хранилища или API
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

      if (!response.ok) throw new Error("Ошибка при сохранении воды");

      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Не удалось сохранить запись о воде");
    }
  };

  return (
    <div className="add-water-menu">
      <div className="add-water-menu-cards-container">
        <img className="bubble" src={bubble} alt="image" />
        <img className="bubble2" src={bubble2} alt="image" />
        <img className="bubble3" src={bubble3} alt="image" />
        <img className="bubble4" src={bubble4} alt="image" />
        <img className="bubble5" src={bubble2} alt="image" />
        <img className="bubble6" src={bubble3} alt="image" />
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              />
              <span className="unit-label">мл</span>
            </div>
          </div>

        <div className="button-save" onClick={handleSave}>
          <div className="div-wrapper-save">
            <div className="text-wrapper-22">Сохранить</div>
          </div>
        </div>

        </div>

      </div>
    </div>
  );
};
