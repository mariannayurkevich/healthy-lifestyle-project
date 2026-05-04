import React, { useEffect, useState, useRef } from "react";
import "../../foodscreenstyle.css";

export const AddFoodMenu = ({ onClose, onSuccess, foodToEdit, trackerId }) => {
  const [formData, setFormData] = useState({
    productName: "",
    datetime: new Date().toISOString().slice(0, 16),
    calories: "",
    proteins: "",
    fats: "",
    carbs: "",
    fiber: "",
    sugar: "",
    weight: ""
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTrackerId, setCurrentTrackerId] = useState(trackerId);

  // === Open Food Facts search state ===
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState(null);
  // хранит нутриенты на 100г из выбранного продукта
  const [selectedProductData, setSelectedProductData] = useState(null);

  // === Barcode scanner state ===
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);

  // === Photo analysis state (оставляем как есть) ===
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // === Инициализация при редактировании ===
  useEffect(() => {
    if (foodToEdit) {
      setIsEditMode(true);
      setFormData({
        productName: foodToEdit.foodName || foodToEdit.rawName || "",
        datetime: foodToEdit.time
            ? new Date(foodToEdit.time).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        calories: foodToEdit.calories || foodToEdit.rawCalories || "",
        proteins: foodToEdit.proteins || foodToEdit.rawProteins || "",
        fats: foodToEdit.fats || foodToEdit.rawFats || "",
        carbs: foodToEdit.carbs || foodToEdit.rawCarbs || "",
        fiber: foodToEdit.fiber || foodToEdit.rawFiber || "",
        sugar: foodToEdit.sugar || foodToEdit.rawSugar || "",
        weight: ""
      });
      if (foodToEdit.trackerId) {
        setCurrentTrackerId(foodToEdit.trackerId);
      }
    }
  }, [foodToEdit]);

  // Пересчёт КБЖУ по весу (использует данные на 100г)
  const recalcByWeight = (weightGrams, productData) => {
    if (!weightGrams || weightGrams <= 0 || !productData) return;
    const factor = weightGrams / 100;
    setFormData(prev => ({
      ...prev,
      calories: (productData.caloriesPer100g * factor).toFixed(1),
      proteins: (productData.proteinsPer100g * factor).toFixed(1),
      fats: (productData.fatsPer100g * factor).toFixed(1),
      carbs: (productData.carbsPer100g * factor).toFixed(1),
      fiber: (productData.fiberPer100g * factor).toFixed(1),
      sugar: (productData.sugarPer100g * factor).toFixed(1),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Если меняется вес и есть загруженный продукт – пересчитываем
    if (name === "weight" && selectedProductData) {
      recalcByWeight(parseFloat(value), selectedProductData);
    }
  };

  // === Поиск по имени (дебаунс) ===
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/v2/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      // ВАЖНО: API возвращает массив в поле "products", а не "content"
      const products = data?.products || [];
      setSearchResults(products);
    } catch (err) {
      console.error("Ошибка поиска продуктов:", err);
      setSearchResults([]);
      alert("Не удалось выполнить поиск. Проверьте соединение с сервером.");
    } finally {
      setIsSearching(false);
    }
  };

  // === Запрос детальной информации по штрихкоду ===
  const fetchProductDetails = async (barcode) => {
    try {
      const response = await fetch(`/api/v1/products/${barcode}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      // Для отладки – посмотрите в консоли браузера, что пришло с сервера
      console.log("Product details:", data);

      if (data.status === 0 || !data.product) {
        alert("Продукт не найден в базе Open Food Facts");
        return null;
      }

      const product = data.product;
      const nut = product.nutriments || {};

      // ---- Извлечение значений на 100 г (без суффикса _100g) ----
      // Белки
      let proteinsPer100 = parseFloat(nut.proteins) || parseFloat(nut["proteins_100g"]) || 0;
      // Жиры
      let fatsPer100 = parseFloat(nut.fat) || parseFloat(nut["fat_100g"]) || 0;
      // Углеводы
      let carbsPer100 = parseFloat(nut.carbohydrates) || parseFloat(nut["carbohydrates_100g"]) || 0;
      // Клетчатка
      let fiberPer100 = parseFloat(nut.fiber) || parseFloat(nut["fiber_100g"]) || 0;
      // Сахар
      let sugarPer100 = parseFloat(nut.sugars) || parseFloat(nut["sugars_100g"]) || 0;

      // Энергия (калории) – более хитрая логика
      let caloriesPer100 = 0;
      // Сначала ищем прямое поле energy-kcal (может быть с суффиксом или без)
      if (nut["energy-kcal_100g"]) caloriesPer100 = parseFloat(nut["energy-kcal_100g"]);
      else if (nut["energy-kcal"]) caloriesPer100 = parseFloat(nut["energy-kcal"]);
      else if (nut.energy) {
        let energyVal = parseFloat(nut.energy);
        if (!isNaN(energyVal)) {
          // Если значение больше 100 – скорее всего это килоджоули (кДж),
          // переводим в килокалории (1 ккал = 4,184 кДж)
          if (energyVal > 100) caloriesPer100 = energyVal / 4.184;
          else caloriesPer100 = energyVal;
        }
      }

      const productData = {
        caloriesPer100g: caloriesPer100,
        proteinsPer100g: proteinsPer100,
        fatsPer100g: fatsPer100,
        carbsPer100g: carbsPer100,
        fiberPer100g: fiberPer100,
        sugarPer100g: sugarPer100,
      };
      setSelectedProductData(productData);

      // Название продукта (русское или английское)
      const productName = product.product_name_ru || product.product_name || "Продукт";
      setFormData(prev => ({ ...prev, productName }));

      // Если пользователь уже ввёл вес – пересчитываем КБЖУ
      const currentWeight = parseFloat(formData.weight);
      if (!isNaN(currentWeight) && currentWeight > 0) {
        recalcByWeight(currentWeight, productData);
      } else {
        // Если вес не задан, очищаем поля, чтобы пользователь его ввёл
        setFormData(prev => ({
          ...prev,
          calories: "",
          proteins: "",
          fats: "",
          carbs: "",
          fiber: "",
          sugar: ""
        }));
      }
      return productData;
    } catch (err) {
      console.error("Ошибка получения деталей продукта:", err);
      alert("Не удалось загрузить данные о продукте. Попробуйте позже.");
      return null;
    }
  };

  // === Обработка выбора продукта из результатов поиска ===
  const handleSelectProduct = async (product) => {
    const barcode = product.code;
    if (!barcode) return;
    setSelectedProductCode(barcode);
    setSearchQuery("");
    setSearchResults([]);
    await fetchProductDetails(barcode);
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      alert("Укажите вес порции в граммах, чтобы автоматически рассчитать КБЖУ.");
    }
  };

  // === Поиск по штрихкоду (ручной ввод) ===
  const handleBarcodeSearch = async () => {
    const barcode = barcodeInput.trim();
    if (!barcode) {
      alert("Введите штрихкод");
      return;
    }
    setIsLoadingBarcode(true);
    await fetchProductDetails(barcode);
    setIsLoadingBarcode(false);
  };

  // === Обработка фото (анализ еды) – остаётся без изменений ===
  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const weightValue = parseFloat(formData.weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      alert("Пожалуйста, укажите вес блюда в граммах перед анализом фото.");
      return;
    }

    setSelectedImage(file);
    setImageLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", file);
      formDataToSend.append("weight", weightValue.toString());

      const response = await fetch("/api/food/analyze-food", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Ошибка анализа изображения: ${response.status}`);
      }

      const analysisResult = await response.json();
      if (analysisResult.products && Array.isArray(analysisResult.products) && analysisResult.products.length > 0) {
        setFormData(prev => ({
          ...prev,
          productName: analysisResult.products[0].title || "Распознанная еда",
          calories: analysisResult.totalKilocalories?.toFixed(1) ?? "",
          proteins: analysisResult.totalProteins?.toFixed(1) ?? "",
          fats: analysisResult.totalFats?.toFixed(1) ?? "",
          carbs: analysisResult.totalCarbohydrates?.toFixed(1) ?? "",
          fiber: analysisResult.totalFiber?.toFixed(1) ?? "",
        }));
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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // === Сохранение записи ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.datetime || !formData.calories) {
      alert("Пожалуйста, заполните обязательные поля: название продукта, дату-время и количество калорий.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const entryDateTime = new Date(formData.datetime).toISOString();
      const trackerDate = formData.datetime.slice(0, 10);

      const foodEntry = {
        time: entryDateTime,
        foodName: formData.productName,
        calories: parseFloat(formData.calories) || 0,
        proteins: parseFloat(formData.proteins) || 0,
        fats: parseFloat(formData.fats) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fiber: parseFloat(formData.fiber) || 0,
        sugar: parseFloat(formData.sugar) || 0
      };

      let response;

      if (isEditMode && currentTrackerId) {
        const trackerResponse = await fetch(`/api/food/${currentTrackerId}`);
        if (!trackerResponse.ok) {
          throw new Error("Не удалось загрузить текущий трекер");
        }

        const existingTracker = await trackerResponse.json();

        const updatedEntries = existingTracker.entries.filter(entry =>
            !(entry.foodName === foodToEdit.foodName &&
                new Date(entry.time).getTime() === new Date(foodToEdit.time).getTime())
        );

        updatedEntries.push(foodEntry);

        const updatedTracker = {
          date: trackerDate,
          entries: updatedEntries
        };

        response = await fetch(`/api/food/${currentTrackerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTracker),
          credentials: "include"
        });
      } else {
        const foodTracker = {
          date: trackerDate,
          entries: [foodEntry]
        };

        response = await fetch(`/api/food?userId=${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(foodTracker),
          credentials: "include"
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сохранения данных: ${response.status} - ${errorText}`);
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
      if (!onSuccess) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Не удалось сохранить запись о питании: " + err.message);
    }
  };

  // === Удаление записи ===
  const handleDelete = async () => {
    if (!currentTrackerId || !foodToEdit) {
      alert("Невозможно удалить запись: недостаточно данных");
      return;
    }

    if (!window.confirm("Вы уверены, что хотите удалить эту запись о питании?")) {
      return;
    }

    try {
      const trackerResponse = await fetch(`/api/food/${currentTrackerId}`);
      if (!trackerResponse.ok) {
        throw new Error("Не удалось загрузить текущий трекер");
      }

      const existingTracker = await trackerResponse.json();

      const updatedEntries = existingTracker.entries.filter(entry =>
          !(entry.foodName === foodToEdit.foodName &&
              new Date(entry.time).getTime() === new Date(foodToEdit.time).getTime())
      );

      if (updatedEntries.length === 0) {
        const deleteResponse = await fetch(`/api/food/${currentTrackerId}`, {
          method: "DELETE",
          credentials: "include"
        });
        if (!deleteResponse.ok) {
          throw new Error("Ошибка удаления трекера");
        }
      } else {
        const updatedTracker = {
          date: existingTracker.date,
          entries: updatedEntries
        };
        const updateResponse = await fetch(`/api/food/${currentTrackerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTracker),
          credentials: "include"
        });
        if (!updateResponse.ok) {
          throw new Error("Ошибка обновления трекера");
        }
      }

      if (onSuccess) onSuccess();
      onClose();
      if (!onSuccess) window.location.reload();
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Не удалось удалить запись о питании: " + err.message);
    }
  };

  // --------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------
  return (
      <div className="add-food-menu">
        <div className="add-food-menu-container">
          <form className="food-data-form" onSubmit={handleSubmit} style={{ maxHeight: '120vh', overflowY: 'auto' }}>
            {/* Блок фото и веса */}
            <div className="photo-section">
              <div className="weight-input-row" style={{ marginBottom: '12px' }}>
                <label htmlFor="weight" style={{ marginRight: '8px' }}>Вес блюда (г):</label>
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    className="input-field"
                    value={formData.weight}
                    onChange={handleChange}
                    step="1"
                    min="1"
                    placeholder="Например, 250"
                    style={{ width: '120px' }}
                    required={!isEditMode}
                />
              </div>
              <div className="button-add-photo">
                <button type="button" onClick={handleAddPhoto} disabled={imageLoading} className="photo-upload-button">
                  {imageLoading ? (
                      <><span className="loading-spinner"></span> Анализ...</>
                  ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                          <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Выбрать фото
                      </>
                  )}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: 'none' }} disabled={imageLoading} />
              <p className="photo-hint">Сфотографируйте свою еду для автоматического расчета КБЖУ</p>
            </div>

            <hr className="form-divider" />

            {/* БЛОК ПОИСКА ПО ИМЕНИ */}
            <div className="search-section">
              <label htmlFor="searchProduct">Поиск в Open Food Facts (по названию)</label>
              <input
                  type="text"
                  id="searchProduct"
                  className="input-field"
                  placeholder="Введите название продукта или бренда..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && <div className="search-loading">Поиск...</div>}
              {searchResults.length > 0 && (
                  <ul className="search-results">
                    {searchResults.map(product => (
                        <li key={product.code} onClick={() => handleSelectProduct(product)}>
                          <strong>{product.product_name_ru || product.product_name || "Без названия"}</strong>
                          {product.brands && <span style={{ fontSize: "0.8rem", color: "#666" }}> ({product.brands})</span>}
                        </li>
                    ))}
                  </ul>
              )}
            </div>

            <hr className="form-divider" />

            {/* БЛОК ПОИСКА ПО ШТРИХКОДУ */}
            <div className="search-section">
              <label htmlFor="barcode">Поиск по штрихкоду</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    id="barcode"
                    className="input-field"
                    placeholder="Введите штрихкод (13 цифр)"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button type="submit" onClick={handleBarcodeSearch} disabled={isLoadingBarcode} className="button-save">
                  {isLoadingBarcode ? "Загрузка..." : "Найти"}
                </button>
              </div>
            </div>

            <hr className="form-divider" />

            {/* ОСНОВНЫЕ ПОЛЯ ФОРМЫ */}
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
              <input type="number" id="calories" name="calories" className="input-field" value={formData.calories} onChange={handleChange} step="0.1" required />
              <span className="unit-label">ккал</span>
            </div>

            <label htmlFor="proteins">Протеины:</label>
            <div className="input-with-unit">
              <input type="number" id="proteins" name="proteins" className="input-field" value={formData.proteins} onChange={handleChange} step="0.1" />
              <span className="unit-label">г</span>
            </div>

            <label htmlFor="fats">Жиры:</label>
            <div className="input-with-unit">
              <input type="number" id="fats" name="fats" className="input-field" value={formData.fats} onChange={handleChange} step="0.1" />
              <span className="unit-label">г</span>
            </div>

            <label htmlFor="carbs">Углеводы:</label>
            <div className="input-with-unit">
              <input type="number" id="carbs" name="carbs" className="input-field" value={formData.carbs} onChange={handleChange} step="0.1" />
              <span className="unit-label">г</span>
            </div>

            <label htmlFor="fiber">Клетчатка:</label>
            <div className="input-with-unit">
              <input type="number" id="fiber" name="fiber" className="input-field" value={formData.fiber} onChange={handleChange} step="0.1" />
              <span className="unit-label">г</span>
            </div>

            <label htmlFor="sugar">Сахар:</label>
            <div className="input-with-unit">
              <input type="number" id="sugar" name="sugar" className="input-field" value={formData.sugar} onChange={handleChange} step="0.1" />
              <span className="unit-label">г</span>
            </div>

            <div className="form-actions-row">
              <button type="button" className="button-cancel" onClick={onClose}>Отмена</button>
              {isEditMode && <button type="button" className="button-delete" onClick={handleDelete}>Удалить</button>}
              <button type="submit" className="button-save" disabled={imageLoading}>
                {imageLoading ? "Анализ..." : (isEditMode ? "Обновить" : "Сохранить")}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};