import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable"; 
import BackgroundGroup from "./components/background";
import SleepText from "./components/goodnighttext";
import SleepTimer from "./components/timer";
import MenuGroup from "./components/pagemenu";
import AddMenu from "./components/addsleepmenu";
import "./sleepscreenstyle.css";

export const SleepScreen = () => {
  const navigate = useNavigate();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate("/main"),
    delta: 50,
  });

  // Обработчики кликов для меню
  const handleMenuClick = () => navigate("/main");
  const handleMenuClick2 = () => navigate("/statistic");
  const handleMenuClick3 = () => navigate("/chat");
  const handleMenuClick4 = () => navigate("/account");
  const handleMenuClick5 = () => navigate("/sleep");

  // Callback для открытия окна AddMenu, вызывается при остановке таймера
  const handleTimerStop = () => {
    setIsAddMenuOpen(true);
  };

  // Callback для закрытия окна AddMenu
  // При закрытии окно сбрасывается и очищается память таймера
  const handleAddMenuClose = () => {
    setIsAddMenuOpen(false);
    // Очистка localStorage для таймера
    localStorage.removeItem("sleepTimerIsRunning");
    localStorage.removeItem("sleepTimerAccumulatedTime");
    localStorage.removeItem("sleepTimerStartTime");
    localStorage.removeItem("sleepTimerTimer");
    // Обновляем ключ для принудительной переинициализации SleepTimer
    setTimerResetKey(prev => prev + 1);
  };

  return (
    <div className="sleepscreen" {...swipeHandlers}>
      <BackgroundGroup />
      <SleepText />
      {/* Передаем onTimerStop и key для сброса в SleepTimer */}
      <SleepTimer key={timerResetKey} onTimerStop={handleTimerStop} />
      <MenuGroup 
        onMenuClickAccount={handleMenuClick4}
        onMenuClickSleep={handleMenuClick5}
        onMenuClickMain={handleMenuClick}
        onMenuClickStatistic={handleMenuClick2}
        onMenuClickChat={handleMenuClick3}
      />
      {/* Отображаем окно AddMenu, если isAddMenuOpen true */}
      {isAddMenuOpen && <AddMenu onClose={handleAddMenuClose} />}
    </div>
  );
};

export default SleepScreen;
