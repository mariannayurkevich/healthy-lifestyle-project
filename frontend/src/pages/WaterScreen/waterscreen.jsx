// Предположим, что компонент AddWaterMenu экспортируется из нужного файла
import React, {useEffect, useState} from "react";
import "./waterscreenstyle.css";
import vector from "./src/vector.svg";
import WaterRecord from "./components/WaterRecord/waterrecord";
import { useNavigate } from "react-router-dom";
import { AddWaterMenu } from "./components/AddWaterMenu/addwatermenu"; // Проверьте правильный путь

export const WaterScreen = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [totalIntakeMl, setTotalIntakeMl] = useState(0);

  // Функция для загрузки записей
  const loadWaterData = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const reportResponse = await fetch(`/report/today?userId=${userId}`);
      const report = await reportResponse.json();
      setTotalIntakeMl(report.totalIntakeMl || 0);

      const response = await fetch(`/api/water/user/${userId}`);

      if (!response.ok) throw new Error("Ошибка загрузки данных");

      const data = await response.json();

      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

      const formattedRecords = data.flatMap(tracker =>
          tracker.entries
              .filter(entry => new Date(entry.time).toISOString().split('T')[0] === today)
              .map(entry => ({
                id: `${tracker.id}-${entry.time}`,
                volume: `${entry.amountMl} мл`,
                label: new Date(entry.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }))
      );

      setRecords(formattedRecords);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  useEffect(() => {
    loadWaterData();
  }, []);

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
            <div className="text-wrapper-3">{totalIntakeMl} мл</div>
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
