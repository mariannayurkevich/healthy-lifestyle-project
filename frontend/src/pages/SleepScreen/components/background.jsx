import React from "react"; 
import subtract from "../src/subtract.svg"; 
import star2 from "../src/star-2.svg"; 
import star5 from "../src/star-2.svg"; 
import star3 from "../src/star-2.svg"; 
import star7 from "../src/star-2.svg"; 
import star4 from "../src/star-2.svg"; 
import line98 from "../src/line-98.svg"; 
import line99 from "../src/line-99.svg"; 
import cloud from "../src/cloud.png"; 
import line87 from "../src/line-87.svg"; 
import line88 from "../src/line-88.svg"; 
import star6 from "../src/star-2.svg"; 
import star8 from "../src/star-2.svg"; 
import star9 from "../src/star-2.svg"; 
import bigEyeLeft from "../src/big-eye-left.png"; 
import bigEyeRight from "../src/big-eye-right.png"; 
import line100 from "../src/line-100.svg"; 
import vector2 from "../src/vector-2.svg"; 
import littleEntity from "../src/little.png"; 
import littleEye from "../src/little-eye.png"; 
import vector3 from "../src/vector-3.svg"; 

const BackgroundGroup = () => { 
    return ( 
      <div className="background-group"> 
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
                          <img className="cloud" alt="Cloud" src={cloud} /> 
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
                
                <div className="overlap-wrapper"> 
                  <div className="overlap-4"> 
                    <img className="mask-group-left" alt="Eyes" src={bigEyeLeft} /> 
                    <img className="mask-group-right" alt="Eyes" src={bigEyeRight} /> 
                  </div> 
                </div> 
                
                <img className="line-5" alt="Line" src={line100} /> 
                <img className="vector" alt="Vector" src={vector2} /> 
                <div className="div-wrapper"> 
                  <div className="overlap-5"> 
                    <img className="vector-2" alt="Entity" src={littleEntity} /> 
                    <img className="mask-group-3" alt="Eyes" src={littleEye} /> 
                  </div> 
                </div> 
                
                <img className="vector-3" alt="Vector" src={vector3} /> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    ); 
}; 

export default BackgroundGroup;