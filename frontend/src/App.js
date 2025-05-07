// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Импорты ваших страниц
import { SleepScreen } from "./pages/SleepScreen/sleepscreen";
import { MainScreen } from "./pages/MainScreen/mainscreen";
import { FirstScreen } from "./pages/FirstScreen/firstscreen"; 
import { EntryScreen } from "./pages/EntryScreen/entryscreen";
import { RegistrationFirstScreen } from "./pages/RegistrationFirst/registrationfirst";
import { RegistrationSecondScreen } from "./pages/RegistrationSecond/registrationsecond";
import { StatisticScreen } from "./pages/StatisticScreen/statisticscreen";
import { ChatScreen } from "./pages/ChatScreen/chatscreen";
import { AccountScreen } from "./pages/AccountScreen/accountscreen";
import { QuestionnaireScreen } from "./pages/QuestionnaireScreen/questionnairescreen";
import { WaterScreen } from "./pages/WaterScreen/waterscreen";
import { ActivityScreen } from "./pages/ActivityScreen/activityscreen";
import { FoodScreen } from "./pages/FoodScreen/foodscreen";

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
        <Route path="/first" element={<FirstScreen />} />
        <Route path="/registrationfirst" element={<RegistrationFirstScreen />} />
        <Route path="/registrationsecond" element={<RegistrationSecondScreen />} />
        <Route path="/statistic" element={<StatisticScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/account" element={<AccountScreen />} />
        <Route path="/water" element={<WaterScreen />} />
        <Route path="/activity" element={<ActivityScreen />} />
        <Route path="/food" element={<FoodScreen />} />
      </Routes>
    </AnimatePresence>
  );
};

const RoutesWrapper = () => {
  const location = useLocation();

  // Отображаем оверлей, если в location.state установлен флаг fromRegistrationSecond
  const showOverlay = location.state?.fromRegistrationSecond === true;

  return (
    <>
      <AnimatedRoutes />
      {showOverlay && <QuestionnaireScreen />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <RoutesWrapper />
    </Router>
  );
}

export default App;
