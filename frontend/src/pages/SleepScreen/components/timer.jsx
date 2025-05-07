import React, { useState, useEffect } from "react";
import vector4 from "../src/vector-4.svg";
import pause from "../src/pause.svg";

const SleepTimer = ({ onTimerStop }) => {
  // Инициализация состояния: начальные значения равны 0 или null, таймер не запущен.
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // При монтировании компонента пытаемся восстановить данные из localStorage,
  // если ранее таймер был запущен.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIsRunning = localStorage.getItem("sleepTimerIsRunning");
      if (storedIsRunning === "true") {
        // Считываем сохранённые данные
        const storedStartTime = localStorage.getItem("sleepTimerStartTime");
        const storedAccumulatedTime = localStorage.getItem("sleepTimerAccumulatedTime");
        
        // Приводим к числу или устанавливаем дефолтное значение
        const realStartTime = storedStartTime ? parseInt(storedStartTime, 10) : Date.now();
        const realAccumulatedTime = storedAccumulatedTime ? parseInt(storedAccumulatedTime, 10) : 0;
        
        // Вычисляем актуальное значение таймера на основе разницы во времени
        const computedTimer = Math.floor((Date.now() - realStartTime) / 1000) + realAccumulatedTime;
        
        setIsRunning(true);
        setStartTime(realStartTime);
        setAccumulatedTime(realAccumulatedTime);
        setTimer(computedTimer);
      } else {
        // Если флаг отсутствует или равен "false" – сбрасываем состояния
        setIsRunning(false);
        setStartTime(null);
        setAccumulatedTime(0);
        setTimer(0);
        
        // Обновляем данные, отвечающие за таймер в localStorage
        localStorage.setItem("sleepTimerIsRunning", "false");
        localStorage.removeItem("sleepTimerStartTime");
        localStorage.removeItem("sleepTimerAccumulatedTime");
        localStorage.removeItem("sleepTimerTimer");
      }
    }
  }, []);

  // Синхронизируем состояние таймера с localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isRunning) {
        localStorage.setItem("sleepTimerIsRunning", "true");
        if (startTime !== null) {
          localStorage.setItem("sleepTimerStartTime", startTime.toString());
        }
        localStorage.setItem("sleepTimerAccumulatedTime", accumulatedTime.toString());
        localStorage.setItem("sleepTimerTimer", timer.toString());
      } else {
        localStorage.setItem("sleepTimerIsRunning", "false");
        localStorage.removeItem("sleepTimerStartTime");
        localStorage.removeItem("sleepTimerAccumulatedTime");
        localStorage.removeItem("sleepTimerTimer");
      }
    }
  }, [isRunning, startTime, accumulatedTime, timer]);

  // Если таймер активен, обновляем значение каждую секунду.
  useEffect(() => {
    let intervalId = null;
    if (isRunning && startTime !== null) {
      intervalId = setInterval(() => {
        // Вычисляем текущее значение таймера: разница между текущим временем и startTime + ранее накопленное время.
        const newTimer = Math.floor((Date.now() - startTime) / 1000) + accumulatedTime;
        setTimer(newTimer);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime, accumulatedTime]);

  // Форматируем секунды в строку "hh:mm:ss"
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Обработчик клика по кнопке: запускает или останавливает таймер.
  const handleToggle = () => {
    if (isRunning) {
      // Остановка таймера: сброс состояний.
      setIsRunning(false);
      setStartTime(null);
      setAccumulatedTime(0);
      setTimer(0);
      if (onTimerStop) onTimerStop();
    } else {
      // Запуск таймера: фиксируем текущее время как startTime.
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  return (
    <div className="sleep-timer-group overlap-6">
      <img
        className="vector-4"
        alt="Timer Button"
        src={isRunning ? pause : vector4}
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      />
      <div className="text-wrapper-2">{formatTime(timer)}</div>
    </div>
  );
};

export default SleepTimer;
