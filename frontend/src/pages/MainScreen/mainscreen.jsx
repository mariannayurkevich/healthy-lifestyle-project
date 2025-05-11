// MainScreen.jsx
import React, {useEffect, useState} from "react";
import water from "./src/water-tracker.svg";
import food from "./src/food-tracker.svg";
import groupCloud from "./src/group-cloud.svg";
import line89 from "./src/line-89.svg";
import activeAi from "./src/active-ai.svg";
import "./mainscreenstyle.css";
import MenuGroup from "../../components/PageMenu/pagemenu";
import AddMenu from "../SleepScreen/components/addsleepmenu"
import { useNavigate } from "react-router-dom";

export const MainScreen = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [dailyReport, setDailyReport] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [totalIntakeMl, setTotalIntakeMl] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // Запрос данных пользователя
        const userResponse = await fetch(`/api/users/id/${userId}`);
        const user = await userResponse.json();
        setUserData(user);

        // Запрос ежедневного отчета
        const reportResponse = await fetch(`/report/today?userId=${userId}`);
        const report = await reportResponse.json();
        setDailyReport(report);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchData();
  }, []);

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

  // Изменяем обработчик для открытия AddMenu:
  const handleMenuClick6 = () => {
    setShowAddMenu(true);
  };

  const handleMenuClick7 = () => {
    navigate("/water");
  };

  const handleMenuClick8 = () => {
    navigate("/activity");
  };

  const handleMenuClick9 = () => {
    navigate("/food");
  };

  return (
    <div className="mainscreen">
      <div className="div">
        <div className="text-wrapper">Привет,</div>
        <div className="text-wrapper-2">
          {userData ? `${userData.firstName} ${userData.lastName}` : "Загрузка..."}
        </div>
        <MenuGroup 
          activePage={"main"}
          onMenuClickAccount={handleMenuClick4}
          onMenuClickSleep={handleMenuClick5}
          onMenuClickMain={handleMenuClick}
          onMenuClickStatistic={handleMenuClick2}
          onMenuClickChat={handleMenuClick3}
        />

        <div className="overlap">
          <div className="group">
            <img className="water" alt="Group" src={water} onClick={handleMenuClick7}/>
            <div className="text-wrapper-9">Вода</div>
            <div className="text-wrapper-10">
              {dailyReport ? `${(dailyReport.totalIntakeMl / 1000).toFixed(1)} л` : "0.0 л"}
            </div>
          </div>
          
          <div className="image">
            <img className="food" alt="Vector" src={food} onClick={handleMenuClick9}/>
            <div className="text-wrapper-11">Питание</div>
            <div className="text-wrapper-12">
              {dailyReport ? `${Math.round(dailyReport.totalCalories)} Ккал` : "0 Ккал"}
            </div>
          </div>

          <div className="overlap-group">
            <div className="rectangle" onClick={handleMenuClick8} />
            <div className="ellipse" />
            <img className="line" alt="Line" src={line89} />

            <div className="overlap-group-wrapper">
              <img className="activeAi" alt="Group" src={activeAi} />
            </div>

            <p className="p">
              <span className="text-wrapper-4">Активность </span>
              <span className="text-wrapper-5">
            {dailyReport ? `${dailyReport.activityDurationMinutes} мин` : "0 мин"}
          </span>
            </p>
          </div>

          <div className="overlap-wrapper">
            <div className="overlap-2">
              {/* При клике по этому элементу открывается AddMenu */}
              <div className="rectangle-2" onClick={handleMenuClick6} />
              <p className="element-2">
                <span className="text-wrapper-6">
            {dailyReport ? Math.round(dailyReport.sleepDuration) : "0"}
          </span>
                <span className="text-wrapper-7">&nbsp;</span>
                <span className="text-wrapper-3">ЧАСОВ</span>
              </p>
              <div className="text-wrapper-8">Сон</div>
              <div className="div-wrapper">
                <div className="overlap-3">
                  <img className="group-cloud" alt="Group" src={groupCloud} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Условный рендер модального окна AddMenu */}
        {showAddMenu && <AddMenu onClose={() => setShowAddMenu(false)} />}

      </div>
    </div>
  );
};
