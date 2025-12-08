import React, {useEffect, useState} from "react";
import leftEye from "./src/left-eye.svg";
import rightEye from "./src/right-eye.svg";
import ai from "./src/ai.svg";
import "./statisticscreenstyle.css";
import MenuGroup from "../../components/PageMenu/pagemenu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/report";

const useWeeklyData = (userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setError("User ID is required");
          setLoading(false);
          return;
        }

        console.log("Fetching data for userId:", userId);

        const response = await axios.get(`${API_URL}/week`, {
          params: {
            userId: userId,
            startDate: new Date().toISOString().split('T')[0]
          }
        });

        console.log("API Response:", response.data);

        let processedData = response.data;

        if (Array.isArray(processedData)) {
          setData(processedData.reverse());
        } else {
          console.warn("Backend returned non-array data, treating as empty:", processedData);
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching weekly data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return { data, loading, error };
};

const formatDay = (dateString) => {
  const date = new Date(dateString);
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
};

// График питания (сглаженная кривая) с дополнительной осью (y-ось)
const NutritionChart = ({ weeklyData }) => {
  const data = weeklyData.map(d => d.totalCalories); // калории
  const days = weeklyData.map(d => formatDay(d.date));
  const svgWidth = 350;
  const svgHeight = 150;
  const margin = { left: 60, right: 20, top: 20, bottom: 20 };

  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const scaleY = (value) => {
    const range = svgHeight - margin.top - margin.bottom;
    return svgHeight - margin.bottom - ((value - minY) / (maxY - minY)) * range;
  };

  const numTicks = 5;
  const tickValues = [];
  for (let i = 0; i < numTicks; i++) {
    const value = minY + ((maxY - minY) * i) / (numTicks - 1);
    tickValues.push(value);
  }

  const points = data.map((d, i) => ({
    x: margin.left + i * ((svgWidth - margin.left - margin.right) / (data.length - 1)),
    y: scaleY(d),
  }));

  const generateSmoothPath = (pts) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathData = generateSmoothPath(points);

  return (
    <div className="chart">
      <h3 className="chart-title">Питание</h3>
      <svg width={svgWidth} height={svgHeight}>
        <g className="y-axis">
          {tickValues.map((val, i) => {
            const yPos = scaleY(val);
            return (
              <g key={i}>
                <line
                  x1={margin.left - 5}
                  y1={yPos}
                  x2={svgWidth - margin.right}
                  y2={yPos}
                  stroke="#ccc"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text className="chart-text" x={margin.left - 10} y={yPos + 4} textAnchor="end">
                  {Math.round(val)}
                </text>
              </g>
            );
          })}
        </g>
        <path d={pathData} fill="none" stroke="#FFAF1B" strokeWidth="4" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill="#FFAF1B"
            stroke="#fdfaff"
            strokeWidth="2"
          />
        ))}
        {points.map((p, i) => (
          <text key={i} className="chart-text" x={p.x} y={svgHeight - 5} textAnchor="middle">
            {days[i]}
          </text>
        ))}
      </svg>
    </div>
  );
};

// График воды (вертикальная гистограмма) с дополнительной y-осью
const WaterChart = ({ weeklyData }) => {
  const data = weeklyData.map(d => d.totalIntakeMl); // мл
  const days = weeklyData.map(d => formatDay(d.date));
  const svgWidth = 350;
  const svgHeight = 150;
  const margin = { left: 60, right: 20, top: 20, bottom: 20 };

  const minValue = 0;
  const maxValue = Math.max(...data);
  const scaleY = (val) => {
    const range = svgHeight - margin.top - margin.bottom;
    return svgHeight - margin.bottom - (val / maxValue) * range;
  };

  const numTicks = 5;
  const tickValues = [];
  for (let i = 0; i < numTicks; i++) {
    const value = (maxValue * i) / (numTicks - 1);
    tickValues.push(value);
  }

  const groupWidth = (svgWidth - margin.left - margin.right) / data.length;
  const barWidth = groupWidth - 10;

  return (
    <div className="chart">
      <h3 className="chart-title">Вода</h3>
      <svg width={svgWidth} height={svgHeight}>
        <g className="y-axis">
          {tickValues.map((val, i) => {
            const yPos = scaleY(val);
            return (
              <g key={i}>
                <line
                  x1={margin.left - 5}
                  y1={yPos}
                  x2={svgWidth - margin.right}
                  y2={yPos}
                  stroke="#ccc"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text className="chart-text" x={margin.left - 10} y={yPos + 4} textAnchor="end">
                  {Math.round(val)}
                </text>
              </g>
            );
          })}
        </g>
        {data.map((d, i) => {
          const x = margin.left + i * groupWidth;
          const barHeight = (d / maxValue) * (svgHeight - margin.top - margin.bottom);
          const y = svgHeight - margin.bottom - barHeight;
          return (
            <rect key={i} x={x + 5} y={y} width={barWidth} height={barHeight} fill="#48B9FF" />
          );
        })}
        {data.map((_, i) => {
          const x = margin.left + i * groupWidth + groupWidth / 2;
          return (
            <text key={i} className="chart-text" x={x} y={svgHeight - 5} textAnchor="middle">
              {days[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// График сна (горизонтальная гистограмма) с дополнительной x-осью для числовых значений
const SleepChart = ({ weeklyData }) => {
  const data = weeklyData.map(d => d.sleepDuration);
  const days = weeklyData.map(d => formatDay(d.date));
  const baseSvgWidth = 350;
  const margin = { left: 50, right: 20, top: 20, bottom: 40 };
  const fixedBarThickness = ((baseSvgWidth - margin.left - margin.right) / 7) - 10; // ≈34px
  const gap = 10;
  const svgHeight = margin.top + margin.bottom + data.length * fixedBarThickness + (data.length - 1) * gap;

  const minValue = 0;
  const maxValue = Math.max(...data);
  const scaleX = (val) => {
    const range = baseSvgWidth - margin.left - margin.right;
    return margin.left + (val / maxValue) * range;
  };

  const numTicks = 5;
  const tickValues = [];
  for (let i = 0; i < numTicks; i++) {
    const value = (maxValue * i) / (numTicks - 1);
    tickValues.push(value);
  }

  return (
    <div className="chart">
      <h3 className="chart-title">Сон</h3>
      <svg width={baseSvgWidth} height={svgHeight}>
        <g className="x-axis">
          {tickValues.map((val, i) => {
            const xPos = scaleX(val);
            return (
              <g key={i}>
                <line
                  x1={xPos}
                  y1={margin.top}
                  x2={xPos}
                  y2={svgHeight - margin.bottom}
                  stroke="#ccc"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  className="chart-text"
                  x={xPos}
                  y={svgHeight - margin.bottom + 15}
                  textAnchor="middle"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}
        </g>
        {data.map((d, i) => {
          const y = margin.top + i * (fixedBarThickness + gap);
          const barWidth = scaleX(d) - margin.left;
          return (
            <rect
              key={i}
              x={margin.left}
              y={y}
              width={barWidth}
              height={fixedBarThickness}
              fill="#722CFF"
            />
          );
        })}
        {data.map((_, i) => {
          const y = margin.top + i * (fixedBarThickness + gap) + fixedBarThickness / 2 + 4;
          return (
            <text key={i} className="chart-text" x={margin.left - 10} y={y} textAnchor="end">
              {days[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// График активности (ломаная кривая) с дополнительной осью (y-ось)
const ActivityChart = ({ weeklyData }) => {
  const data = weeklyData.map(d => d.activityDurationMinutes);
  const days = weeklyData.map(d => formatDay(d.date));
  const svgWidth = 350;
  const svgHeight = 150;
  const margin = { left: 40, right: 20, top: 20, bottom: 20 };

  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const scaleY = (value) => {
    const range = svgHeight - margin.top - margin.bottom;
    return svgHeight - margin.bottom - ((value - minY) / (maxY - minY)) * range;
  };

  const numTicks = 5;
  const tickValues = [];
  for (let i = 0; i < numTicks; i++) {
    const value = minY + ((maxY - minY) * i) / (numTicks - 1);
    tickValues.push(value);
  }

  const points = data.map((d, i) => ({
    x: margin.left + i * ((svgWidth - margin.left - margin.right) / (data.length - 1)),
    y: scaleY(d),
  }));

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="chart">
      <h3 className="chart-title">Активность</h3>
      <svg width={svgWidth} height={svgHeight}>
        <g className="y-axis">
          {tickValues.map((val, i) => {
            const yPos = scaleY(val);
            return (
              <g key={i}>
                <line
                  x1={margin.left - 5}
                  y1={yPos}
                  x2={svgWidth - margin.right}
                  y2={yPos}
                  stroke="#ccc"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text className="chart-text" x={margin.left - 10} y={yPos + 4} textAnchor="end">
                  {Math.round(val)}
                </text>
              </g>
            );
          })}
        </g>
        <polyline
          points={polyPoints}
          fill="none"
          stroke="#69E200"
          strokeWidth="4"
          strokeLinejoin="miter"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill="#69E200"
            stroke="#fdfaff"
            strokeWidth="2"
          />
        ))}
        {points.map((p, i) => (
          <text key={i} className="chart-text" x={p.x} y={svgHeight - 5} textAnchor="middle">
            {days[i]}
          </text>
        ))}
      </svg>
    </div>
  );
};

export const StatisticScreen = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  console.log("Current userId from localStorage:", userId);
  const { data: weeklyData, loading, error } = useWeeklyData(userId);
  console.log("Weekly data state:", { weeklyData, loading, error });

  if (loading) {
    console.log("Loading...");
    return <div className="loading">Загрузка данных...</div>;
  }
  if (error) {
    console.log("Error:", error);
    return <div className="error">Ошибка: {error}</div>;
  }

  if (!weeklyData || weeklyData.length === 0) {
    console.log("No data available");
    return (
        <div className="statisticscreen">
          <div className="div">
            <div className="text-wrapper">Статистика</div>
            <div className="advice">Нет данных для отображения</div>
            <MenuGroup
                activePage={"statistic"}
                onMenuClickAccount={() => navigate("/account")}
                onMenuClickSleep={() => navigate("/sleep")}
                onMenuClickMain={() => navigate("/main")}
                onMenuClickStatistic={() => navigate("/statistic")}
                onMenuClickChat={() => navigate("/chat")}
            />
          </div>
        </div>
    );
  }

  console.log("Rendering with data:", weeklyData);

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

  return (
    <div className="statisticscreen">
      <div className="div">
        <div className="text-wrapper">Статистика</div>

        {/* Фоновая картинка ai */}
        <img className="ai" alt="vector" src={ai} />

        {/* Блок с overlay (например, навигация: День, Неделя, Месяц) */}
        <div className="overlap-wrapper">
          <div className="overlap">
            {/*
            <div className="text-wrapper-2">День</div>
            */}
            <div className="overlap-group-2">
              <div className="text-wrapper-3">Неделя</div>
            </div>
            {/*
            <div className="text-wrapper-4">Месяц</div>
            */}
          </div>
        </div>

        {/* Текст "Совет." перемещён на задний фон */}
        <p className="advice">
          <span className="span">Совет.</span>
          <span className="text-wrapper-5">&nbsp;</span>
          <span className="text-wrapper-6">
            Чтобы узнать <br />
            подробную информацию <br />
            про отметку на графике, <br />
            зажмите выбранную <br />
            точку - Ассистент <br />
            все расскажет.
          </span>
        </p>

        <div className="charts-container">
          <NutritionChart weeklyData={weeklyData} />
          <WaterChart weeklyData={weeklyData} />
          <SleepChart weeklyData={weeklyData} />
          <ActivityChart weeklyData={weeklyData} />
        </div>
      </div>
      <MenuGroup
        activePage={"statistic"}
        onMenuClickAccount={handleMenuClick4}
        onMenuClickSleep={handleMenuClick5}
        onMenuClickMain={handleMenuClick}
        onMenuClickStatistic={handleMenuClick2}
        onMenuClickChat={handleMenuClick3}
      />
    </div>
  );
};

export default StatisticScreen;
