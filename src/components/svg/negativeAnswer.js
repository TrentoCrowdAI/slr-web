import React from "react";

/**
 * component svg
 */
const NegativeAnswer = function (props) {

    return (
        <svg id="negative-answer" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000">
            <line class="st-tick" x1="181" y1="181" x2="819" y2="819" style={{stroke: (props.color) ? props.color : ""}}/>
            <line class="st-tick" x1="819" y1="181" x2="181" y2="819" style={{stroke: (props.color) ? props.color : ""}}/>
        </svg>
    );
};

export default NegativeAnswer;
