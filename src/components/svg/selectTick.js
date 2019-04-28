import React from "react";

/**
 * component svg close-btn
 */
const SelectTick = function (props) {

    return (
        <svg id="select-tick" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000">
            <polyline className="st-tick" points="918,192.3 389.3,807.7 82,450 ">
                <animate attributeName="points" dur="0.2s" repeatCount="1" fill="freeze"
                    from="500,600 400,700 200,750"
                    to="918,192.3 389.3,807.7 82,450 "
                />
            </polyline>
        </svg>
    );
};

export default SelectTick;
