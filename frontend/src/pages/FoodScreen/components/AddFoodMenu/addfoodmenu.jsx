import React, { useState, useRef } from "react";
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

  // Состояния для работы с изображением
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Обработка изменений в полях ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Функция для обработки добавления фото
  const handleAddPhoto = () => {
    // Активируем скрытый input для выбора файла
    fileInputRef.current.click();
  };

  // Обработка выбора файла
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setImageLoading(true);

    try {
      // Создаем FormData для отправки изображения
      const formData = new FormData();
      formData.append("image", file);

      // Отправляем изображение на сервер для анализа
      const response = await fetch("/api/food/analyze-food", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка анализа изображения: ${response.status}`);
      }

      const analysisResult = await response.json();
      console.log("Результат анализа:", analysisResult);

      // Обновляем форму данными из анализа
      if (analysisResult.products && analysisResult.products.length > 0) {
        // Если есть несколько продуктов, используем первый продукт
        if (analysisResult.products.length === 1) {
          const product = analysisResult.products[0];
          updateFormWithProduct(product);
        } else {
          // Используем общие суммы для комплексного блюда
          updateFormWithTotals(analysisResult);
        }

        alert("Еда успешно распознана! Данные автоматически заполнены.");
      } else {
        alert("Не удалось распознать еду на изображении. Заполните данные вручную.");
      }
    } catch (error) {
      console.error("Ошибка при анализе изображения:", error);
      alert("Ошибка при анализе изображения. Проверьте подключение к API.");
    } finally {
      setImageLoading(false);
    }
  };

  // Обновление формы данными одного продукта
  const updateFormWithProduct = (product) => {
    // Рассчитываем фактические значения на основе веса
    const ratio = product.weight / 100;
    setFormData(prev => ({
      ...prev,
      productName: product.title || "Распознанная еда",
      calories: (product.kilocalories_per100g * ratio).toFixed(1),
      proteins: (product.proteins_per100g * ratio).toFixed(1),
      fats: (product.fats_per100g * ratio).toFixed(1),
      carbs: (product.carbohydrates_per100g * ratio).toFixed(1),
      fiber: (product.fiber_per100g * ratio).toFixed(1),
    }));
  };

  // Обновление формы общими суммами
  const updateFormWithTotals = (analysisResult) => {
    setFormData(prev => ({
      ...prev,
      productName: `Комплексное блюдо (${analysisResult.products.length} продуктов)`,
      calories: analysisResult.totalKilocalories.toFixed(1),
      proteins: analysisResult.totalProteins.toFixed(1),
      fats: analysisResult.totalFats.toFixed(1),
      carbs: analysisResult.totalCarbohydrates.toFixed(1),
      fiber: analysisResult.totalFiber.toFixed(1),
    }));
  };

  // Обработчик удаления изображения
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          <form className="food-data-form" onSubmit={handleSubmit} style={{ maxHeight: '120vh', overflowY: 'auto' }}>

            {/* Секция для загрузки фото */}
            <div className="photo-section">
              {/* Кнопка выбора фото */}
              <div className="button-add-photo">
                <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={imageLoading}
                    className="photo-upload-button"
                >
                  {imageLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Анализ...
                      </>
                  ) : (
                      <>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: '8px' }}
                        >
                          <path
                              d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          />
                        </svg>
                        Выбрать фото
                      </>
                  )}
                </button>
              </div>

              {/* Скрытый input для выбора файла */}
              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={imageLoading}
              />

              {/* Подсказка */}
              <p className="photo-hint">
                Сфотографируйте свою еду для автоматического расчета КБЖУ
              </p>
            </div>

            <hr className="form-divider" />

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
                  step="0.1"
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
                  step="0.1"
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
                  step="0.1"
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
                  step="0.1"
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
                  step="0.1"
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
                  step="0.1"
              />
              <span className="unit-label">г</span>
            </div>

            <div className="form-actions-row">
              <button type="button" className="button-cancel" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="button-save" disabled={imageLoading}>
                {imageLoading ? "Анализ..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};