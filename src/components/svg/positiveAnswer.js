import React from "react";

/**
 * component svg
 */
const PositiveAnswer = function (props) {

    return (
        <svg id="positive-answer" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000">
            <polyline className="st-tick" points="918,192.3 389.3,807.7 82,450 " style={{stroke: (props.color) ? props.color : ""}}/>
        </svg>
    );
};

export default PositiveAnswer;
