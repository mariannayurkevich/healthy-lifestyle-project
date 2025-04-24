import React from "react";
import group35 from "./src/group-35.png";
//import image2 from "./src/image-2.png";
//import image from "./src/image.png";
//import image1 from "./src/image.svg";
import line87 from "./src/line-87.svg";
import line88 from "./src/line-88.svg";
import line89 from "./src/line-89.svg";
//import maskGroup from "./src/mask-group.png";
import star2 from "./src/star-2.svg";
import star3 from "./src/star-3.svg";
import star4 from "./src/star-4.svg";
import star5 from "./src/star-5.svg";
import "./mainscreenstyle.css";
import subtract from "./src/subtract.svg";
//import union2 from "./src/union-2.svg";
//import union from "./src/union.svg";
import vector5 from './src/vector-3.svg';
import group34 from './src/group-34.svg';
import vector6 from './src/group-36.svg';
import vector7 from './src/vector-38.svg';
import group from './src/group-37.svg';

import { useNavigate } from "react-router-dom";

export const MainScreen = () => {
    const navigate = useNavigate();
    
      // Функция обработки клика
      const handleClick = () => {
        // Переход к экрану MainScreen
        navigate('/sleep');
      };

  return (
    <div className="mainscreen">
      <div className="div">
        <div className="text-wrapper">Привет,</div>

        <div className="text-wrapper-2">Малинка Ди</div>

        <div className="view-3">
            <img className="vector-5" alt="Vector" src={vector5} />

            <div className="group-wrapper">
              <img className="vector-6" alt="Vector" src={vector6} />
            </div>
      
            <img
              className="group-3"
              alt="Group"
              src={group34}
              onClick={handleClick}
              style={{ cursor: "pointer" }}
            />

            <img className="vector-7" alt="Vector" src={vector7} />

            <img className="group-4" alt="Group" src={group} />
          </div>

        <div className="overlap">
          <img className="group" alt="Group" src={group35} />
{/*}
          <img className="image" alt="Image" src={image} />
*/}
          <div className="view">
            <div className="overlap-group">
              <div className="rectangle" />

              <div className="ellipse" />

              <img className="line" alt="Line" src={line89} />

              <div className="overlap-group-wrapper">
                <div className="mask-group-wrapper">
                {/*
                  <img
                    className="mask-group"
                    alt="Mask group"
                    src={maskGroup}
                  />
                  */}
                </div>
              </div>

              <p className="element">
                <span className="span">
                  4<br />
                </span>

                <span className="text-wrapper-3">КМ</span>
              </p>

              <p className="p">
                <span className="text-wrapper-4">Активность </span>

                <span className="text-wrapper-5">50 мин</span>
              </p>
            </div>
          </div>

          <div className="overlap-wrapper">
            <div className="overlap-2">
              <div className="rectangle-2" />

              <p className="element-2">
                <span className="text-wrapper-6">8</span>

                <span className="text-wrapper-7">&nbsp;</span>

                <span className="text-wrapper-3">ЧАСОВ</span>
              </p>

              <div className="text-wrapper-8">Сон</div>

              <div className="div-wrapper">
                <div className="overlap-3">
                  <img className="subtract" alt="Subtract" src={subtract} />

                  <img className="star" alt="Star" src={star2} />

                  <img className="img" alt="Star" src={star5} />

                  <img className="star-2" alt="Star" src={star3} />

                  <img className="star-3" alt="Star" src={star4} />

                  <div className="view-2">
                    <div className="overlap-group-2">
                        {/*}
                      <img className="union" alt="Union" src={union} />

                      <img className="union-2" alt="Union" src={image1} />

                      <img className="union-3" alt="Union" src={union2} />
                      */}

                      <img className="line-2" alt="Line" src={line87} />

                      <img className="line-3" alt="Line" src={line88} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
        <img className="img-2" alt="Img" src={image2} />
        */}
      </div>
    </div>
  );
};
