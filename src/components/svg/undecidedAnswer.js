import React from "react";

/**
 * component svg
 */
const UndecidedAnswer = function (props) {

    return (
        <svg id="undecided-answer" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000">
            <path className="st-tick" d="M161,500c0,0,165.4-62.4,339,0s339,0,339,0" style={{stroke: (props.color) ? props.color : ""}}/>
            <circle className="st-tick" cx="500" cy="500" r="381" style={{stroke: (props.color) ? props.color : ""}}/>
        </svg>
    );
};

export default UndecidedAnswer;
