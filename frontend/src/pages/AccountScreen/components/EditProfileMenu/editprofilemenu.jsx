import React, { useState } from "react";
import x1 from "../../src/eye-right.svg";
import x2 from "../../src/eye-left.svg";
import vectorPrev from "../../src/pointer.svg";
import "../../accountscreenstyle.css"; // можно подключить и отдельный CSS для редактирования профиля

export const EditProfileMenu = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    birthday: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
    allergies: "",
    intolerances: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверка обязательных полей профиля
    if (
      !formData.username ||
      !formData.birthday ||
      !formData.gender ||
      !formData.height ||
      !formData.weight ||
      !formData.goal ||
      !formData.activityLevel
    ) {
      alert("Пожалуйста, заполните все обязательные поля личных данных.");
      return;
    }

    // Если вводится пароль, то проверяем подтверждение
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    console.log("Данные профиля", formData);
    onClose();
  };

  return (
    <div className="edit-profile-menu">
      <div className="edit-profile-container">
        {/* Хедер с надписью "Назад" и иконкой 
        <div className="header-back" onClick={onClose}>
          <div className="back-text">Назад</div>
          <img className="back-icon" alt="Назад" src={vectorPrev} />
        </div>
        */}
        <div className="header-back" onClick={onClose}>
          <img className="back-icon" alt="Назад" src={vectorPrev} />
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Перемещённый блок overlap-group-wrapper теперь находится непосредственно в форме */}
          <div className="overlap-group-wrapper-2">
            <div className="overlap-group-2">
              <img className="element-2" alt="Element" src={x1} />
              <img className="img-2" alt="Element" src={x2} />
            </div>
          </div>
          
          <label htmlFor="username">Имя пользователя*</label>
          <input
            type="text"
            id="username"
            name="username"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="birthday">Дата рождения*</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            className="input-field"
            value={formData.birthday}
            onChange={handleChange}
            required
          />

          <label htmlFor="gender">Пол*</label>
          <select
            id="gender"
            name="gender"
            className="input-field"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужчина</option>
            <option value="female">Женщина</option>
          </select>

          <label htmlFor="height">Рост*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="height"
              name="height"
              className="input-field"
              value={formData.height}
              onChange={handleChange}
              required
            />
            <span className="unit-label">см</span>
          </div>

          <label htmlFor="weight">Вес*</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="weight"
              name="weight"
              className="input-field"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <span className="unit-label">кг</span>
          </div>

          <label htmlFor="goal">Цель*</label>
          <select
            id="goal"
            name="goal"
            className="input-field"
            value={formData.goal}
            onChange={handleChange}
            required
          >
            <option value="">Выберите цель</option>
            <option value="weight_loss">Потеря веса</option>
            <option value="maintenance">Поддержание веса</option>
            <option value="weight_gain">Набор веса</option>
          </select>

          <label htmlFor="activityLevel">Уровень активности*</label>
          <select
            id="activityLevel"
            name="activityLevel"
            className="input-field"
            value={formData.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="">Выберите уровень активности</option>
            <option value="sedentary">Сидячий образ жизни</option>
            <option value="low">Низкая физическая активность</option>
            <option value="moderate">Умеренная физическая активность</option>
            <option value="high">Интенсивная физическая активность</option>
            <option value="very_high">
              Очень интенсивная физическая активность
            </option>
          </select>

          <label htmlFor="allergies">Аллергии</label>
          <textarea
            id="allergies"
            name="allergies"
            className="input-field"
            value={formData.allergies}
            onChange={handleChange}
          />

          <label htmlFor="intolerances">Непереносимости</label>
          <textarea
            id="intolerances"
            name="intolerances"
            className="input-field"
            value={formData.intolerances}
            onChange={handleChange}
          />

          <hr className="separator" />

          <label htmlFor="email">Электронная почта*</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
          />

          {formData.password && (
            <>
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </>
          )}

          <div className="button-save">
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};
