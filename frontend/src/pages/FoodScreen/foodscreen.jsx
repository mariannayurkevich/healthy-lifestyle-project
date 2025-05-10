import React, { useState } from "react";
import line100 from "./src/line-100.svg";
import maskGroup2 from "./src/mask-group-2.svg";
import maskGroup from "./src/mask-group.svg";
import "./foodscreenstyle.css";
import vector5 from "./src/vector-5.svg";
import vector from "./src/vector.svg";
import { AddFoodMenu } from "./components/AddFoodMenu/addfoodmenu";
import FoodRecord from "./components/FoodRecord/foodrecord";

import { useNavigate } from "react-router-dom";

export const FoodScreen = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([
      { id: 1, volume: "500 ккал", label: "Еда", grams: "100 г" },
      { id: 2, volume: "500 ккал", label: "Еда", grams: "100 г" }
    ]);
    const [showAddMenu, setShowAddMenu] = useState(false);

  // При нажатии на кнопку открываем меню
  const handleFoodClick = () => {
    setShowAddMenu(true);
  };

  // Функция для закрытия AddActivityMenu (ее можно передать для обработки закрытия в этом компоненте)
  const handleCloseAddMenu = () => {
    setShowAddMenu(false);
  };
    
      const handleClick = () => {
        navigate('/main');
      };

  return (
    <div className="foodscreen">
      <div className="group">
              <div className="overlap-group-2">
                <img className="mask-group" alt="Mask group" src={maskGroup2} />

                <img className="img" alt="Mask group" src={maskGroup} />
              </div>
            </div>
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            

            <div className="text-wrapper">Питание</div>

            <div className="text-wrapper-2">Сегодня</div>

            <div className="div-2">
              <div className="text-wrapper-3">Назад</div>

              <img className="vector" alt="Vector" src={vector} onClick={handleClick}/>
            </div>

            <div className="text-wrapper-4">0 ККал</div>
          </div>

          {/* Контейнер для списка записей с скроллом */}
          <div className="food-records-container">
              {records.map((record) => (
                <FoodRecord
                  key={record.id}
                  volume={record.volume}
                  label={record.label}
                  grams= {record.grams}
                />
              ))}
            </div>
          
        </div>

       

        <div className="overlap-wrapper">
          <div className="div-wrapper" onClick={handleFoodClick}>
            <div className="text-wrapper-7">+ Еда</div>
          </div>
        </div>
      </div>
      {/* Условная отрисовка компонента AddWaterMenu */}
                  {showAddMenu && (
                    <div className="add-food-menu-container">
                      {/* Можно передать функцию закрытия в AddWaterMenu, чтобы он сам мог закрываться */}
                      <AddFoodMenu onClose={handleCloseAddMenu} />
                    </div>
                  )}
    </div>
  );
};
