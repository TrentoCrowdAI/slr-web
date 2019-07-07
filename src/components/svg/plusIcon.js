import React from "react";

/**
 * component svg select arrow
 * 'focused' is a flag used for displaying a different shape
 */
const PlusIcon = function ({focused, code}) {
    var from="";
    var to="";
    //I check if the upper component is focused and then I animate
    if(focused){
        from={y1: "100", y2: "900"};
        to={y1: "500", y2: "500"};
    }else{
        from={y1: "500", y2: "500"};
        to={y1: "100", y2: "900"};
    }
    return (
    <svg version="1.1" id="plus-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 1000 1000">
            <line className="st0-plus" x1="900" y1="500" x2="100" y2="500"/>
            <line className="st0-plus" x1="500" y1="100" x2="500" y2="900">
            <animate attributeType="XML" 
                id={(isNaN(code)) ? "ani-plus-icon-y1" : "ani-plus-icon-y1" + code} 
                attributeName="y1" from={from.y1} to={to.y1} begin="0s" dur="0.2s" repeatCount="1" fill="freeze" />
            <animate attributeType="XML" 
                id={(isNaN(code)) ? "ani-plus-icon-y2" : "ani-plus-icon-y2" + code} 
                attributeName="y2" from={from.y2} to={to.y2} begin="0s" dur="0.2s" repeatCount="1" fill="freeze" />
            </line>
        </svg>
    );
};

export default PlusIcon;

