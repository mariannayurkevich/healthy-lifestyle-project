import React, { useState } from "react";
import "../../foodscreenstyle.css";

export const AddFoodMenu = ({ onClose }) => {
    const [currentCard, setCurrentCard] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="add-food-menu">
      <div className="add-food-menu-cards-container">
        <div className="add-food-menu-cards" >

          <div className="button-save" onClick={onClose}>
            <div className="div-wrapper-save">
              <div className="text-wrapper-22">Сохранить</div>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};
