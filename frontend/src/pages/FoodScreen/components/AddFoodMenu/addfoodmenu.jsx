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
    carbs: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.datetime || !formData.calories) {
      alert("Пожалуйста, заполните обязательные поля: название продукта, дату-время и количество калорий.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Пользователь не авторизован");

      // Преобразование даты и времени
      const entryTime = new Date(formData.datetime).toISOString();
      const trackerDate = formData.datetime.slice(0, 10);

      // Формируем запись о еде
      const foodEntry = {
        time: entryTime,
        foodName: formData.productName,
        calories: parseFloat(formData.calories),
        proteins: parseFloat(formData.proteins) || 0,
        fats: parseFloat(formData.fats) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fiber: parseFloat(formData.fiber) || 0,
        sugar: parseFloat(formData.sugar) || 0
    };

      const foodTracker = {
        date: trackerDate,
        entries: [foodEntry],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Отправка данных
      const response = await fetch(`/api/food?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foodTracker),
        credentials: "include"
      });

      if (!response.ok) throw new Error("Ошибка сохранения данных");

      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Не удалось сохранить запись о питании");
    }
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

      <label htmlFor="carbs">Углеводы:</label>
      <div className="input-with-unit">
        <input
          type="number"
          id="carbs"
          name="carbs"
          className="input-field"
          value={formData.carbs}
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
