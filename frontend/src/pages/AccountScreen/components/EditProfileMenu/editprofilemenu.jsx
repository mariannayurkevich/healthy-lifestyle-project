import React, {useEffect, useState} from "react";
import x1 from "../../src/eye-right.svg";
import x2 from "../../src/eye-left.svg";
import vectorPrev from "../../src/pointer.svg";
import "../../accountscreenstyle.css"; // можно подключить и отдельный CSS для редактирования профиля

export const EditProfileMenu = ({ userData, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    birthDate: "",
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

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        birthDate: userData.birthDate?.split('T')[0] || "",
        gender: userData.gender || "",
        height: userData.height || "",
        weight: userData.weight || "",
        goal: userData.goal || "MAINTAIN",
        activityLevel: userData.activityLevel || "sedentary",
        allergies: userData.allergies || "",
        intolerances: userData.intolerances || "",
        email: userData.email || ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        allergies: formData.allergies,
        intolerances: formData.intolerances,
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "HTTP error " + response.status);
      }

      onClose(true);
      alert("Изменения успешно сохранены!");
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message || "Не удалось сохранить изменения");
    }
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
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="birthday">Дата рождения*</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            className="input-field"
            value={formData.birthDate}
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
              min="100"
              max="250"
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
              min="30"
              max="300"
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
            <option value="LOSE">Потеря веса</option>
            <option value="MAINTAIN">Поддержание веса</option>
            <option value="GAIN">Набор веса</option>
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
            <option value="light">Низкая физическая активность</option>
            <option value="moderate">Умеренная физическая активность</option>
            <option value="active">Интенсивная физическая активность</option>
            <option value="very_active">
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
