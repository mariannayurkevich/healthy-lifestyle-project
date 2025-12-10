import React, {useEffect, useState} from "react";
import line99 from "../../src/line-99.svg";
import plane from "../../src/plane.svg";
import line999 from "../../src/line-999.svg";
import "../../activityscreenstyle.css";

export const AddActivityMenu = ({ onClose, onSuccess, activityToEdit }) => {
  const [formData, setFormData] = useState({
    activityName: "",
    datetime: new Date().toISOString().slice(0, 16),
    duration: "",
    caloriesBurned: ""
  });

  useEffect(() => {
    if (activityToEdit) {
      setFormData({
        activityName: activityToEdit.rawType,
        datetime: new Date(activityToEdit.rawTimestamp).toISOString().slice(0, 16),
        duration: activityToEdit.rawDuration,
        caloriesBurned: activityToEdit.rawCalories
      });
    }
  }, [activityToEdit]);

  // Обработка изменения значений в полях
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async () => {
    if (!activityToEdit) return;

    const confirmDelete = window.confirm("Вы уверены, что хотите удалить эту активность?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/activity/${activityToEdit.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
          window.location.reload();
        }
      } else {
        alert("Ошибка при удалении активности");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  // Отправка данных формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!formData.activityName || !formData.datetime || !formData.duration || !formData.caloriesBurned) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    const payload = {
      activityType: formData.activityName,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned),
      activityTimestamp: formData.datetime,
      userId: userId
    };

    try {
      let response;
      if (activityToEdit) {
        // Режим редактирования (PUT)
        response = await fetch(`/api/activity/${activityToEdit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Режим добавления (POST)
        response = await fetch(`/api/activity?userId=${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
          window.location.reload();
        }
      } else {
        alert("Ошибка при сохранении активности");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="add-activity-menu">
      <img className="line-99" src={line99} alt="Line" />
      <div className="add-activity-menu-container">
        
        <div className="background-group-lines">
          <img className="line-999" src={line999} alt="Line" />
        </div>

        <div className="plane-background">
          <img className="plane" src={plane} alt="Vector" />
        </div>

        <form className="activity-data-form" onSubmit={handleSubmit}>
          <label htmlFor="activityName">Название активности:*</label>
          <input
            type="text"
            id="activityName"
            name="activityName"
            className="input-field"
            value={formData.activityName}
            onChange={handleChange}
            required
          />

          <label htmlFor="datetime">Дата-время:*</label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            className="input-field"
            value={formData.datetime}
            onChange={handleChange}
            required
          />

          <label htmlFor="duration">Длительность:*</label>
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

          <label htmlFor="caloriesBurned">Количество калорий:*</label>
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

          <div className="form-actions-row">
            <button
                type="button"
                className="button-cancel"
                onClick={onClose}
            >
              Отмена
            </button>

            {activityToEdit && (
                <button
                    type="button"
                    className="button-delete"
                    onClick={handleDelete}
                >
                  Удалить
                </button>
            )}

            <button
                type="submit"
                className="button-save"
            >
              {activityToEdit ? "Обновить" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
