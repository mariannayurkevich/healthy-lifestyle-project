import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundGroup from "./components/background";
import SleepText from "./components/goodnighttext";
import SleepTimer from "./components/timer";
import MenuGroup from "./components/pagemenu";
import "./sleepscreenstyle.css";

export const SleepScreen = () => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/main');
  };

  return (
    <div className="sleepscreen">
      {/* Фоновая группа – все декоративные изображения */}
      <BackgroundGroup />
      
      {/* Группа с текстом "Сладких снов" */}
      <SleepText />
      
      {/* Группа с таймером: кнопка и отображение времени */}
      <SleepTimer />
      
      {/* Группа меню, отвечающая за переключение экранов */}
      <MenuGroup onMenuClick={handleMenuClick} />
    </div>
  );
};
