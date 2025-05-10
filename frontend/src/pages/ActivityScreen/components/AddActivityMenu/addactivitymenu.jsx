import React, { useState } from "react";
import "../../activityscreenstyle.css";

export const AddActivityMenu = ({ onClose }) => {
  // Объект состояния для данных формы активности
  const [formData, setFormData] = useState({
    activityName: "",
    // Текущее время по формату datetime-local
    datetime: new Date().toISOString().slice(0, 16),
    duration: "",
    caloriesBurned: ""
  });

  // Обработка изменения значений в полях
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Отправка данных формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем, чтобы все обязательные поля были заполнены
    if (
      !formData.activityName ||
      !formData.datetime ||
      !formData.duration ||
      !formData.caloriesBurned
    ) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    console.log("Данные формы активности", formData);
    onClose();
  };

  return (
    <div className="add-activity-menu">
      <div className="add-activity-menu-container">
        <form className="activity-data-form" onSubmit={handleSubmit}>
          <label htmlFor="activityName">Название активности*</label>
          <input
            type="text"
            id="activityName"
            name="activityName"
            className="input-field"
            value={formData.activityName}
            onChange={handleChange}
            required
          />

          <label htmlFor="datetime">Дата-время*</label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            className="input-field"
            value={formData.datetime}
            onChange={handleChange}
            required
          />

          <label htmlFor="duration">Длительность (мин)*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="duration"
              name="duration"
              className="input-field"
              value={formData.duration}
              onChange={handleChange}
              required
            />
            <span className="unit-label">мин</span>
          </div>

          <label htmlFor="caloriesBurned">Количество сжённых калорий*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="caloriesBurned"
              name="caloriesBurned"
              className="input-field"
              value={formData.caloriesBurned}
              onChange={handleChange}
              required
            />
            <span className="unit-label">ккал</span>
          </div>

          <div className="button-save">
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};
