import React, { useState } from "react";
import "../../foodscreenstyle.css";

export const AddFoodMenu = ({ onClose }) => {
  // Собираем данные формы в один объект состояния
  const [formData, setFormData] = useState({
    productName: "",
    // Значение по умолчанию: текущее время в формате, совместимом с datetime-local (YYYY-MM-DDTHH:MM)
    datetime: new Date().toISOString().slice(0, 16),
    calories: "",
    proteins: "",
    fats: "",
    carbohydrates: "",
    fiber: "",
    sugar: ""
  });

  // Обработка изменений в полях ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    // Проверка обязательных полей
    if (!formData.productName || !formData.datetime || !formData.calories) {
      alert("Пожалуйста, заполните обязательные поля: название продукта, дату-время и количество калорий.");
      return;
    }
    // Здесь можно добавить отправку данных на сервер или любое другое действие.
    console.log("Данные формы", formData);
    // Закрываем меню после сохранения
    onClose();
  };

  return (
    <div className="add-food-menu">
  <div className="add-food-menu-container">
    <form className="food-data-form" onSubmit={handleSubmit}>
      <label htmlFor="productName">Название продукта (блюда)*</label>
      <input
        type="text"
        id="productName"
        name="productName"
        className="input-field"
        value={formData.productName}
        onChange={handleChange}
        required
      />

      <label htmlFor="datetime">Дата-время приема*</label>
      <input
        type="datetime-local"
        id="datetime"
        name="datetime"
        className="input-field"
        value={formData.datetime}
        onChange={handleChange}
        required
      />

      <label htmlFor="calories">Количество калорий:*</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="calories"
          name="calories"
          className="input-field"
          value={formData.calories}
          onChange={handleChange}
          required
        />
        <span className="unit-label">ккал</span>
      </div>

      <label htmlFor="proteins">Протеины:</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="proteins"
          name="proteins"
          className="input-field"
          value={formData.proteins}
          onChange={handleChange}
        />
        <span className="unit-label">г</span>
      </div>

      <label htmlFor="fats">Жиры:</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="fats"
          name="fats"
          className="input-field"
          value={formData.fats}
          onChange={handleChange}
        />
        <span className="unit-label">г</span>
      </div>

      <label htmlFor="carbohydrates">Углеводы:</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="carbohydrates"
          name="carbohydrates"
          className="input-field"
          value={formData.carbohydrates}
          onChange={handleChange}
        />
        <span className="unit-label">г</span>
      </div>

      <label htmlFor="fiber">Клетчатка:</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="fiber"
          name="fiber"
          className="input-field"
          value={formData.fiber}
          onChange={handleChange}
        />
        <span className="unit-label">г</span>
      </div>

      <label htmlFor="sugar">Сахар:</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="sugar"
          name="sugar"
          className="input-field"
          value={formData.sugar}
          onChange={handleChange}
        />
        <span className="unit-label">г</span>
      </div>

      <div className="button-save">
        <button type="submit">Сохранить</button>
      </div>
    </form>
  </div>
</div>

  );
};
