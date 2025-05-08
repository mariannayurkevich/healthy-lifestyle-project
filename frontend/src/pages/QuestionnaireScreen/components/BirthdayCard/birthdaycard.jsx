import React, {useEffect, useState} from "react";
import vectorPrev from "../../src/left.svg";
import vectorNext from "../../src/right.svg";
import "../../questionnairescreenstyle.css";

export const BirthdayCard = ({ onPrev, onNext, onDataUpdate }) => {
  // Состояния для дня, месяца, года и сообщения об ошибке
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");


  // Функция для получения количества дней в заданном месяце и году
  const getDaysInMonth = (month, year) => {
    // Важно передавать month как число, метод new Date(..., month, 0) вернёт последний день предыдущего месяца = количеству дней в нужном месяце
    return new Date(year, month, 0).getDate();
  };

  // Генерируем список годов от текущего до, например, 1900
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1900; y--) {
    years.push(y);
  }

  // Массив с названиями месяцев (значения от 1 до 12)
  const months = [
    { value: 1, name: "Январь" },
    { value: 2, name: "Февраль" },
    { value: 3, name: "Март" },
    { value: 4, name: "Апрель" },
    { value: 5, name: "Май" },
    { value: 6, name: "Июнь" },
    { value: 7, name: "Июль" },
    { value: 8, name: "Август" },
    { value: 9, name: "Сентябрь" },
    { value: 10, name: "Октябрь" },
    { value: 11, name: "Ноябрь" },
    { value: 12, name: "Декабрь" },
  ];

  // Генерируем список дней.
  // Если месяц и год выбраны — отображаем корректное число дней; иначе — до 31-го.
  let days = [];
  if (month && year) {
    const maxDays = getDaysInMonth(parseInt(month), parseInt(year));
    for (let d = 1; d <= maxDays; d++) {
      days.push(d);
    }
  } else {
    for (let d = 1; d <= 31; d++) {
      days.push(d);
    }
  }

  // Функция проверки корректности выбранной даты
  const validateDate = () => {
    // Проверяем, что все поля заполнены
    if (!day || !month || !year) {
      setError("Заполните все поля даты*");
      return false;
    }
    
    // Преобразуем выбранные значения в числа
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    
    // Создаем объект даты; обратите внимание, что месяц в конструкторе Date начинается с 0
    const selectedDate = new Date(y, m - 1, d);
    
    // Проверяем, что выбранная дата не находится в будущем
    const today = new Date();
    today.setHours(0, 0, 0, 0); // обнуляем время для корректного сравнения
    if (selectedDate > today) {
      setError("Проверьте введенную дату*");
      return false;
    }

    setError("");
    return true;
  };

  // Обертка для навигации: если дата корректна, вызываем переданный callback (напр., onNext или onPrev)
  const handleNavigation = (callback) => {
    if (validateDate()) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onDataUpdate({ birthDate: formattedDate });
      callback();
    }
  };

  return (
    <div className="questionnaire-cards">
      <img
        className="vectorPrevCard"
        alt="Vector"
        src={vectorPrev}
        onClick={onPrev}
      />

      <img
        className="vectorNextCard"
        alt="Vector"
        src={vectorNext}
        onClick={() => handleNavigation(onNext)}
      />

      <p className="textCard">
        <span className="text-wrapper-card">
          Когда твой <br />
        </span>
        <span className="text-wrapper-card-2">День Рождения</span>
        <span className="text-wrapper-card">?</span>
      </p>

      {/* Выпадающие списки для выбора дня, месяца и года */}
      <div className="birthday-dropdowns">
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="" disabled>
            День
          </option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="" disabled>
            Месяц
          </option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="" disabled>
            Год
          </option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Отображаем сообщение об ошибке, если есть */}
        {error && <p className="error-message">{error}</p>}
      </div>

      
    </div>
  );
};

export default BirthdayCard;
