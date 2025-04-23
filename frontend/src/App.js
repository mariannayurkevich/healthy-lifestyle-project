// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Другие импорты, например, стилей и компонентов
import {SleepScreen} from "./pages/SleepScreen/sleepscreen";
import {MainScreen} from "./pages/MainScreen/mainscreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SleepScreen />} />
        <Route path="/main" element={<MainScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
