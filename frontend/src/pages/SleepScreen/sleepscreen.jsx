import React from "react";
import group34 from "./src/group-34.png";
import group from "./src/group.png";
//import image1 from "./src/image.png";
//import image from "./src/image.svg";
import line87 from "./src/line-87.svg";
import line88 from "./src/line-88.svg";
import line98 from "./src/line-98.svg";
import line99 from "./src/line-99.svg";
import line100 from "./src/line-100.svg";
//import maskGroup2 from "./src/mask-group-2.png";
//import maskGroup from "./src/mask-group.png";
import star2 from "./src/star-2.svg";
import star3 from "./src/star-3.svg";
import star4 from "./src/star-4.svg";
import star5 from "./src/star-5.svg";
import star6 from "./src/star-6.svg";
import star7 from "./src/star-7.svg";
import star8 from "./src/star-8.svg";
import star9 from "./src/star-9.svg";
import "./sleepscreenstyle.css";
import subtract from "./src/subtract.svg";
//import union2 from "./src/union-2.svg";
//import union from "./src/union.svg";
import vector2 from "./src/vector-2.svg";
import vector3 from "./src/vector-3.svg";
//import vector4 from "./src/vector-4.svg";
//import vector5 from "./src/vector-5.svg";
//import vector6 from "./src/vector-6.svg";
//import vector7 from "./src/vector-7.svg";
import vector from "./src/vector.svg";

export const SleepScreen = () => {
  return (
    <div className="sleepscreen">
      <div className="div">
        <div className="overlap">
          <div className="view">
            <div className="overlap-group">
              <div className="group">
                <div className="overlap-2">
                  <div className="overlap-3">
                    <img className="subtract" alt="Subtract" src={subtract} />

                    <img className="star" alt="Star" src={star2} />

                    <img className="img" alt="Star" src={star5} />

                    <img className="star-2" alt="Star" src={star3} />

                    <img className="star-3" alt="Star" src={star7} />

                    <img className="star-4" alt="Star" src={star4} />

                    <img className="line" alt="Line" src={line98} />

                    <img className="line-2" alt="Line" src={line99} />

                    <div className="overlap-group-wrapper">
                      <div className="overlap-group-2">
                        {/*
                        <img className="union" alt="Union" src={union} />
                        
                        <img className="union-2" alt="Union" src={image} />

                        <img className="union-3" alt="Union" src={union2} />
                        */}
                        <img className="line-3" alt="Line" src={line87} />

                        <img className="line-4" alt="Line" src={line88} />
                      </div>
                    </div>
                  </div>

                  <img className="star-5" alt="Star" src={star6} />

                  <img className="star-6" alt="Star" src={star8} />

                  <img className="star-7" alt="Star" src={star9} />
                </div>
              </div>
                {/*
              <div className="overlap-wrapper">
                <div className="overlap-4">
                  <img
                    className="mask-group"
                    alt="Mask group"
                    src={maskGroup}
                  />

                  <img className="mask-group-2" alt="Mask group" src={image1} />
                </div>
              </div>
                */}
              <img className="line-5" alt="Line" src={line100} />

              <img className="vector" alt="Vector" src={vector2} />
{/*
              <div className="div-wrapper">
                <div className="overlap-5">
                  <img className="vector-2" alt="Vector" src={vector} />

                  <img
                    className="mask-group-3"
                    alt="Mask group"
                    src={maskGroup2}
                  />
                </div>
              </div>
*/}
              <img className="vector-3" alt="Vector" src={vector3} />
            </div>
          </div>

          <div className="text-wrapper">
            Сладких
            <br />
            снов
          </div>
        </div>
{/*
        <div className="overlap-6">
          <img className="vector-4" alt="Vector" src={vector4} />

          <div className="text-wrapper-2">08:12:56</div>
        </div>
*/}
        <div className="div-2">
          <div className="div-3">
            <div className="div-3">
              <div className="overlap-group-3">
                <div className="text-wrapper-3">5:17</div>
              </div>
            </div>

            <div className="group-2">
              <div className="overlap-7">
                <div className="rectangle" />

                <div className="rectangle-2" />

                <div className="rectangle-3" />
              </div>
            </div>
          </div>

          <div className="view-2">
            {/*
            <img className="vector-5" alt="Vector" src={vector5} />
*/}
            <div className="group-wrapper">
              <img className="group-3" alt="Group" src={group34} />
            </div>
{/*
            <img className="vector-6" alt="Vector" src={vector6} />

            <img className="vector-7" alt="Vector" src={vector7} />
*/}
            <img className="group-4" alt="Group" src={group} />
          </div>
        </div>
      </div>
    </div>
  );
};
