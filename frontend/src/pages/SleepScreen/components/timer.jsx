import React, { useState, useEffect } from "react";
import vector4 from "../src/vector-4.svg";

const SleepTimer = () => {
  // Ленивое считывание значений из localStorage при инициализации состояний.
  const [isRunning, setIsRunning] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sleepTimerIsRunning") === "true";
    }
    return false;
  });

  const [accumulatedTime, setAccumulatedTime] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("sleepTimerAccumulatedTime") || "0", 10);
    }
    return 0;
  });

  const [startTime, setStartTime] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sleepTimerStartTime");
      return saved ? parseInt(saved, 10) : null;
    }
    return null;
  });

  const [timer, setTimer] = useState(() => {
    // Если таймер не работал, начинаем с накопленного времени.
    return accumulatedTime;
  });

  // Сохраняем состояние в localStorage при каждом изменении
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sleepTimerIsRunning", isRunning);
      localStorage.setItem("sleepTimerAccumulatedTime", accumulatedTime);
      if (startTime !== null) {
        localStorage.setItem("sleepTimerStartTime", startTime);
      } else {
        localStorage.removeItem("sleepTimerStartTime");
      }
      localStorage.setItem("sleepTimerTimer", timer);
    }
  }, [isRunning, timer, startTime, accumulatedTime]);

  // Если таймер запущен, обновляем его значение каждую секунду
  useEffect(() => {
    let intervalId = null;
    if (isRunning && startTime !== null) {
      intervalId = setInterval(() => {
        const newTimer = Math.floor((Date.now() - startTime) / 1000) + accumulatedTime;
        setTimer(newTimer);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime, accumulatedTime]);

  // Функция форматирования секунд в строку вида hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Обработчик клика по кнопке (изображение vector-4)
  const handleToggle = () => {
    if (isRunning) {
      // При остановке сохраняем текущее значение в accumulatedTime
      setAccumulatedTime(timer);
      setStartTime(null);
      setIsRunning(false);
    } else {
      // При запуске фиксируем время старта и запускаем таймер
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  return (
    <div className="sleep-timer-group overlap-6">
      <img
        className="vector-4"
        alt="Timer Button"
        src={vector4}
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      />
      <div className="text-wrapper-2">{formatTime(timer)}</div>
    </div>
  );
};

export default SleepTimer;
