import React from "react";

/**
 * component svg close-btn
 */
const RadioTick = function (props) {

    return (
        <svg id="radio-tick" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	        viewBox="0 0 1000 1000">
            <circle class="st-circle" cx="500" cy="500" r="375">
                <animate attributeName="r" dur="0.2s" repeatCount="1" fill="freeze"
                                from="0"
                                to="375"
                />
            </circle>
        </svg>
    );
};

export default RadioTick;
