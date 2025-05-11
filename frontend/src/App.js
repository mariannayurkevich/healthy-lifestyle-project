// App.js
import React from "react";
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
import ProtectedRoute from "./components/ProtectedRoute";

// Оборачиваем маршруты в компонент с анимацией
const AnimatedRoutes = () => {
  return (
      <AnimatePresence exitBeforeEnter>
        <Routes>
          {/* Открытые маршруты */}
          <Route path="/" element={<FirstScreen />} />
          <Route path="/entry" element={<EntryScreen />} />
          <Route path="/registrationfirst" element={<RegistrationFirstScreen />} />
          <Route path="/registrationsecond" element={<RegistrationSecondScreen />} />
          <Route path="/forgotpasswordmenu" element={<ForgotPasswordMenu />} />
          <Route path="/resetpasswordmenu" element={<ResetPasswordCodeMenu />} />

          {/* Защищенные маршруты */}
          <Route element={<ProtectedRoute />}>
            <Route path="/main" element={<MainScreen />} />
            <Route path="/sleep" element={<SleepScreen />} />
            <Route path="/statistic" element={<StatisticScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/account" element={<AccountScreen />} />
            <Route path="/water" element={<WaterScreen />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/food" element={<FoodScreen />} />
            <Route path="/questionnaire" element={<QuestionnaireScreen />} />
          </Route>

          {/* Резервный маршрут */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
  );
};


const RoutesWrapper = () => {
  return <AnimatedRoutes />;
};

function App() {
  return (
    <Router>
      <RoutesWrapper />
    </Router>
  );
}

export default App;
