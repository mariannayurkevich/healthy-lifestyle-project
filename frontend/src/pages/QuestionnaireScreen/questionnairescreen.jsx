import React, { useState } from "react";
import "./questionnairescreenstyle.css";
import { ActivityLevelCard } from "./components/ActiviryLevelCard/activitylevelcard";
import { AimCard } from "./components/AimCard/aimcard";
import { AllergiesCard } from "./components/AllergiesCard/allergiescard";
import { BirthdayCard } from "./components/BirthdayCard/birthdaycard";
import { FinalCard } from "./components/FinalCard/finalcard";
import { FirstCard } from "./components/FirstCard/firstcard";
import { GenderCard } from "./components/GenderCard/gendercard";
import { HeightCard } from "./components/HeightCard/heightcard";
import { IntolerancesCard } from "./components/IntolerancesCard/intolerancescard";
import { WeightCard } from "./components/WeightCard/weightcard";
import {useNavigate} from "react-router-dom";

export const QuestionnaireScreen = () => {
    const navigate = useNavigate();
    const [currentCard, setCurrentCard] = useState(0);
    const [isOpen, setIsOpen] = useState(true);
    const [collectedData, setCollectedData] = useState({});

    const handleDataUpdate = (newData) => {
        setCollectedData(prev => ({ ...prev, ...newData }));
    };

    const handleSubmit = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gender: collectedData.gender,
                    birthDate: collectedData.birthDate,
                    weight: collectedData.weight,
                    height: collectedData.height,
                    goal: collectedData.goal,
                    activityLevel: collectedData.activityLevel,
                    allergies: collectedData.allergies,
                    intolerances: collectedData.intolerances,
                    profileCompleted: true
                })
            });

            if (response.ok) navigate("/main");
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    if (!isOpen) return null;

    const cards = [
      <FirstCard
        key="first"
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <GenderCard
        key="gender"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <BirthdayCard
        key="birthday"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <WeightCard
        key="weight"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <HeightCard
        key="height"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <AimCard
        key="aim"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <ActivityLevelCard
        key="activity"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <AllergiesCard
        key="allergies"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <IntolerancesCard
        key="intolerances"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
        onDataUpdate={handleDataUpdate}
      />,
      <FinalCard
        key="final"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext= {handleSubmit}
      />
    ];

  return (
    <div className="questionnaire">
      <div className="questionnaire-cards-container">
        {cards[currentCard]}
        <div className="questionnaire-cards2" />
        <div className="questionnaire-cards3" />
      </div>
    </div>

  );
};
