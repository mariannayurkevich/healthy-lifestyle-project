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

  // Обработчики кликов для меню
  const handleMenuClick = () => navigate("/main");
  const handleMenuClick2 = () => navigate("/statistic");
  const handleMenuClick3 = () => navigate("/chat");
  const handleMenuClick4 = () => navigate("/account");
  const handleMenuClick5 = () => navigate("/sleep");

  // Варианты анимации сдвига экрана:
  const pageVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: "0%", opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.7,
  };

  return (
    <motion.div
      className="sleepscreen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      {...swipeHandlers}
    >
      <BackgroundGroup />
      <SleepText />
      <SleepTimer />
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
