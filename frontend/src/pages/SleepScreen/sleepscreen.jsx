import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable"; 
import BackgroundGroup from "./components/background";
import SleepText from "./components/goodnighttext";
import SleepTimer from "./components/timer";
import MenuGroup from "./components/pagemenu";
import "./sleepscreenstyle.css";

export const SleepScreen = () => {
  const navigate = useNavigate();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      navigate("/main");
    },
    delta: 50,
  });

  // Обработчик клика по меню, который также ведёт на страницу /main
  const handleMenuClick = () => {
    navigate("/main");
  };

  const handleMenuClick2 = () => {
    navigate("/statistic");
  };

  const handleMenuClick3 = () => {
    navigate("/chat");
  };

  const handleMenuClick4 = () => {
    navigate("/account");
  };

  const handleMenuClick5 = () => {
    navigate("/sleep");
  };

  // Задаём вариант анимации выхода: экран уходит влево с плавным снижением прозрачности
  const pageVariants = {
    out: {
      opacity: 0,
      x: "-100vw",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.7,
  };

  return (
    // Распространяем обработчики свайпа на корневой motion.div
    <motion.div
      className="sleepscreen"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      {...swipeHandlers}
    >
      {/* Фоновая группа – все декоративные изображения */}
      <BackgroundGroup />
      
      {/* Группа с текстом "Сладких снов" */}
      <SleepText />
      
      {/* Группа с таймером: кнопка и отображение времени */}
      <SleepTimer />
      
      {/* Группа меню, отвечающая за переключение экранов */}
      <MenuGroup 
        onMenuClickAccount={handleMenuClick4}
        onMenuClickSleep={handleMenuClick5}
        onMenuClickMain={handleMenuClick}
        onMenuClickStatistic={handleMenuClick2}
        onMenuClickChat={handleMenuClick3}
      />
    </motion.div>
  );
};
