// Предположим, что компонент AddWaterMenu экспортируется из нужного файла
import React, { useState } from "react";
import "./waterscreenstyle.css";
import vector from "./src/vector.svg";
import WaterRecord from "./components/WaterRecord/waterrecord";
import { useNavigate } from "react-router-dom";
import { AddWaterMenu } from "./components/AddWaterMenu/addwatermenu"; // Проверьте правильный путь

export const WaterScreen = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false); // новое состояние для управления видимостью меню

  // При нажатии на кнопку открываем меню
  const handleDrinkClick = () => {
    setShowAddMenu(true);
  };

  // Функция для закрытия AddWaterMenu (ее можно передать для обработки закрытия в этом компоненте)
  const handleCloseAddMenu = () => {
    setShowAddMenu(false);
  };

  const handleClick = () => {
    navigate('/main');
  };

  return (
    <div className="waterscreen">
      <div className="rectangle"></div>
      <div className="rectangle-2"></div>
      <div className="ellipse-3" />
      
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="group">
              <div className="div">
                <div className="ellipse" />
                <div className="ellipse-2" />
              </div>
            </div>
            <div className="overlap-group-wrapper">
              <div className="overlap-2">
                <div className="ellipse-3" />
                <div className="ellipse-4" />
                <div className="ellipse-5" />
              </div>
            </div>
            <div className="div-wrapper">
              {/* При клике здесь открывается меню */}
              <div className="overlap-3" onClick={handleDrinkClick}>
                <div className="text-wrapper">+ Выпить</div>
              </div>
            </div>
            <div className="text-wrapper-2">Вода</div>
            <div className="text-wrapper-3">1800 мл</div>
            <div className="text-wrapper-4">Сегодня</div>

            {/* Контейнер для списка записей с скроллом */}
            <div className="water-records-container">
              {records.map((record) => (
                <WaterRecord
                  key={record.id}
                  volume={record.volume}
                  label={record.label}
                />
              ))}
            </div>
          </div>
          <div className="div-2">
            <div className="text-wrapper-7">Назад</div>
            <img className="img" alt="Vector" src={vector} onClick={handleClick} />
          </div>
        </div>
      </div>

      {/* Условная отрисовка компонента AddWaterMenu */}
      {showAddMenu && (
        <div className="add-water-menu-container">
          {/* Можно передать функцию закрытия в AddWaterMenu, чтобы он сам мог закрываться */}
          <AddWaterMenu onClose={handleCloseAddMenu} />
        </div>
      )}
    </div>
  );
};
