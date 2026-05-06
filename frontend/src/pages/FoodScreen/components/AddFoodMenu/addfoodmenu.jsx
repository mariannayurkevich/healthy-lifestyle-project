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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchNoResults, setSearchNoResults] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState(null);
  const [selectedProductData, setSelectedProductData] = useState(null);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [barcodeNotFound, setBarcodeNotFound] = useState(false);
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

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
    if (name === "weight" && selectedProductData) {
      recalcByWeight(parseFloat(value), selectedProductData);
    }
  };

  // Поиск по имени
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setSearchNoResults(false);
      return;
    }
    const timer = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setIsSearching(true);
    setSearchNoResults(false);
    try {
      const response = await fetch(`/api/v2/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      const products = data?.products || [];
      setSearchResults(products);
      if (products.length === 0) {
        setSearchNoResults(true);
      }
    } catch (err) {
      console.error("Ошибка поиска продуктов:", err);
      setSearchResults([]);
      setSearchNoResults(true);
      // Не показываем alert, только сообщение под полем
    } finally {
      setIsSearching(false);
    }
  };

  // Получение деталей по штрихкоду
  const fetchProductDetails = async (barcode) => {
    try {
      const response = await fetch(`/api/v1/products/${barcode}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      console.log("Product details:", data);

      if (data.status === 0 || !data.product) {
        setBarcodeNotFound(true);
        setTimeout(() => setBarcodeNotFound(false), 5000);
        return null;
      }
      setBarcodeNotFound(false);

      const product = data.product;
      const nut = product.nutriments || {};

      let proteinsPer100 = parseFloat(nut.proteins) || parseFloat(nut["proteins_100g"]) || 0;
      let fatsPer100 = parseFloat(nut.fat) || parseFloat(nut["fat_100g"]) || 0;
      let carbsPer100 = parseFloat(nut.carbohydrates) || parseFloat(nut["carbohydrates_100g"]) || 0;
      let fiberPer100 = parseFloat(nut.fiber) || parseFloat(nut["fiber_100g"]) || 0;
      let sugarPer100 = parseFloat(nut.sugars) || parseFloat(nut["sugars_100g"]) || 0;

      let caloriesPer100 = 0;
      if (nut["energy-kcal_100g"]) caloriesPer100 = parseFloat(nut["energy-kcal_100g"]);
      else if (nut["energy-kcal"]) caloriesPer100 = parseFloat(nut["energy-kcal"]);
      else if (nut.energy) {
        let energyVal = parseFloat(nut.energy);
        if (!isNaN(energyVal)) {
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

      const productName = product.product_name_ru || product.product_name || "Продукт";
      setFormData(prev => ({ ...prev, productName }));

      const currentWeight = parseFloat(formData.weight);
      if (!isNaN(currentWeight) && currentWeight > 0) {
        recalcByWeight(currentWeight, productData);
      } else {
        setFormData(prev => ({
          ...prev,
          calories: "",
          proteins: "",
          fats: "",
          carbs: "",
          fiber: "",
          sugar: ""
        }));
        // Не показываем alert, только текстовое сообщение позже (опционально)
      }
      return productData;
    } catch (err) {
      console.error("Ошибка получения деталей продукта:", err);
      setBarcodeNotFound(true);
      setTimeout(() => setBarcodeNotFound(false), 5000);
      return null;
    }
  };

  const handleSelectProduct = async (product) => {
    const barcode = product.code;
    if (!barcode) return;
    setSelectedProductCode(barcode);
    setSearchQuery("");
    setSearchResults([]);
    await fetchProductDetails(barcode);
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      // Небольшое информационное уведомление без alert
      alert("Укажите вес порции в граммах, чтобы автоматически рассчитать КБЖУ.");
    }
  };

  // Обработка ввода штрихкода: только цифры, не более 13
  const handleBarcodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // удаляем всё, кроме цифр
    if (value.length > 13) value = value.slice(0, 13);
    setBarcodeInput(value);
    setBarcodeError("");
    setBarcodeNotFound(false);
  };

  const handleBarcodeSearch = async () => {
    const barcode = barcodeInput.trim();
    if (barcode.length !== 13) {
      setBarcodeError("Штрихкод должен содержать ровно 13 цифр.");
      return;
    }
    setBarcodeError("");
    setIsLoadingBarcode(true);
    await fetchProductDetails(barcode);
    setIsLoadingBarcode(false);
  };

  // Фото
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
              {searchNoResults && !isSearching && (
                  <div className="no-results-message" style={{ color: '#e67e22', marginTop: '8px', fontSize: '0.9rem' }}>
                    По вашему запросу ничего не найдено. Попробуйте изменить название или воспользоваться поиском по штрихкоду.
                  </div>
              )}
            </div>

            <hr className="form-divider" />

            {/* БЛОК ПОИСКА ПО ШТРИХКОДУ */}
            <div className="search-section">
              <label htmlFor="barcode">Поиск по штрихкоду (13 цифр)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    id="barcode"
                    className="input-field"
                    placeholder="Введите 13-значный штрихкод"
                    value={barcodeInput}
                    onChange={handleBarcodeChange}
                    style={{ flex: 1 }}
                    maxLength={13}
                />
                <button type="button" onClick={handleBarcodeSearch} disabled={isLoadingBarcode} className="button-save">
                  {isLoadingBarcode ? "Загрузка..." : "Найти"}
                </button>
              </div>
              {barcodeError && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                    {barcodeError}
                  </div>
              )}
              {barcodeNotFound && !barcodeError && (
                  <div style={{ color: '#e67e22', fontSize: '0.8rem', marginTop: '4px' }}>
                    Продукт с таким штрихкодом не найден в базе Open Food Facts.
                  </div>
              )}
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