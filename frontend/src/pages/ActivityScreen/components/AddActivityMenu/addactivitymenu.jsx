import React, { useState } from "react";
import "../../activityscreenstyle.css";

export const AddActivityMenu = ({ onClose }) => {
    const [currentCard, setCurrentCard] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="add-activity-menu">
      <div className="add-activity-menu-cards-container">
        <div className="add-activity-menu-cards" >

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
