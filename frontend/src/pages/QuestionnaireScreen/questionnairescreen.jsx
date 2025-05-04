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

export const QuestionnaireScreen = () => {
    const [currentCard, setCurrentCard] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

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
      />,
      <BirthdayCard
        key="birthday"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <WeightCard
        key="weight"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <HeightCard
        key="height"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <AimCard
        key="aim"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <ActivityLevelCard
        key="activity"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <AllergiesCard
        key="allergies"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <IntolerancesCard
        key="intolerances"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setCurrentCard((prev) => prev + 1)}
      />,
      <FinalCard
        key="final"
        onPrev={() => setCurrentCard((prev) => prev - 1)}
        onNext={() => setIsOpen(false)}
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
