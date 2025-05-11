// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Импорты ваших страниц
import { SleepScreen } from "./pages/SleepScreen/sleepscreen";
import { MainScreen } from "./pages/MainScreen/mainscreen";
import { FirstScreen } from "./pages/FirstScreen/firstscreen"; 
import { EntryScreen } from "./pages/EntryScreen/entryscreen";
import { ForgotPasswordMenu } from "./pages/EntryScreen/components/ForgotPasswordMenu/forgotpasswordmenu";
import { ResetPasswordCodeMenu } from "./pages/EntryScreen/components/ResetPasswordMenu/resetpasswordmenu";
import { RegistrationFirstScreen } from "./pages/RegistrationFirst/registrationfirst";
import { RegistrationSecondScreen } from "./pages/RegistrationSecond/registrationsecond";
import { StatisticScreen } from "./pages/StatisticScreen/statisticscreen";
import { ChatScreen } from "./pages/ChatScreen/chatscreen";
import { AccountScreen } from "./pages/AccountScreen/accountscreen";
import { QuestionnaireScreen } from "./pages/QuestionnaireScreen/questionnairescreen";
import { WaterScreen } from "./pages/WaterScreen/waterscreen";
import { ActivityScreen } from "./pages/ActivityScreen/activityscreen";
import { FoodScreen } from "./pages/FoodScreen/foodscreen";

// Импортируем ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute"; // или укажите относительный путь к файлу

//Компонент с анимацией маршрутов
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        {/* Публичные маршруты */}
        <Route path="/" element={<FirstScreen />} />
        <Route path="/first" element={<FirstScreen />} />
        <Route path="/entry" element={<EntryScreen />} />
        <Route path="/registrationfirst" element={<RegistrationFirstScreen />} />

        {/* Переместить в защищённые маршруты */}
        <Route path="/registrationsecond" element={<RegistrationSecondScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/sleep" element={<SleepScreen />} />
        <Route path="/statistic" element={<StatisticScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/account" element={<AccountScreen />} />
        <Route path="/water" element={<WaterScreen />} />
        <Route path="/activity" element={<ActivityScreen />} />
        <Route path="/food" element={<FoodScreen />} />
        <Route path="/password-forgot" element={<ForgotPasswordMenu />} />
        <Route path="/password-reset" element={<ResetPasswordCodeMenu />} />
        
        {/* Защищённые маршруты */}
        <Route element={<ProtectedRoute isAuthenticated={Boolean(localStorage.getItem("authToken"))} />}>
          
        </Route>
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
      {/* Можно использовать либо AnimatedRoutes, либо RoutesWrapper в зависимости от вашей архитектуры */}
      <RoutesWrapper />
    </Router>
  );
}

export default App;
