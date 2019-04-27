import React from "react";

/**
 * component svg close-btn
 */
const RemoveButton = function (props) {

    return (
        <svg id="remove-button" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000">
        <line className="rb" x1="134" y1="866" x2="866" y2="134"/>
        <line className="rb" x1="134" y1="134" x2="866" y2="866"/>
        </svg>
    );
};

export default RemoveButton;
