// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Импорты ваших страниц
import { SleepScreen } from "./pages/SleepScreen/sleepscreen";
import { MainScreen } from "./pages/MainScreen/mainscreen";
import { FirstScreen } from "./pages/FirstScreen/firstscreen"; 
import { EntryScreen } from "./pages/EntryScreen/entryscreen";

// Оборачиваем маршруты в компонент с анимацией
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<FirstScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/sleep" element={<SleepScreen />} />
        <Route path="/entry" element={<EntryScreen />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
