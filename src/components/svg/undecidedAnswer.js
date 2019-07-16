import React from "react";

/**
 * component svg
 */
const UndecidedAnswer = function (props) {

    return (
        <svg id="undecided-answer" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000">
            <g>
                <path className="st0-und" 
                    d="M 500,661.78784 500,544.20058 C 954.19846,189.53532 376.85433,16.13961 335.29677,279.03194"
                    style={{stroke: (props.color) ? props.color : ""}}/>
                <circle className="st1-und" cx="500" cy="853" r="66" style={{fill: (props.color) ? props.color : ""}}/>
            </g>
        </svg>
    );
};

export default UndecidedAnswer;
