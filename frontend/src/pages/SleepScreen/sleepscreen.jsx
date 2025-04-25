import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // импортируем Framer Motion
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

  // Определяем только вариант анимации выхода
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
    <motion.div
      className="sleepscreen"
      // Не задаём initial и animate, поэтому экран появляется мгновенно
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Фоновая группа – все декоративные изображения */}
      <BackgroundGroup />
      
      {/* Группа с текстом "Сладких снов" */}
      <SleepText />
      
      {/* Группа с таймером: кнопка и отображение времени */}
      <SleepTimer />
      
      {/* Группа меню, отвечающая за переключение экранов */}
      <MenuGroup onMenuClick={handleMenuClick} />
    </motion.div>
  );
};
