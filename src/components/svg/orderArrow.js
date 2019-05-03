import React, {useState, useEffect} from "react";

/**
 * component svg order arrow button
@param {string} up [ASC or DESC]
 */
const OrderArrow= function ({display, up}) {

    let output = "";

    let from="";
    let to="";

    //I check where the arrow should point to(up or down) checking the 'up' flag passed by the parent component
    if(up ==="ASC"){
        from="371.7,293 500,165 628.3,293 ";
        to="371.7,491.9 500,619.9 628.3,491.9 ";
    }else{
        from="371.7,491.9 500,619.9 628.3,491.9 ";
        to="371.7,293 500,165 628.3,293 ";
    }

    const [destination, setDestination] = useState(to);

    useEffect(() => {
      setDestination(to);
    }, [to])

    if(display){
        output = (
            <svg version="1.1" id="order-arrow" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1000 1000" >
                <polyline className="st-order-arrow-head" points="371.7,293 500,165 628.3,293 " transform="matrix(1.5303008,0,0,1.5303008,-279.47582,-105.57059)">
                    <animate attributeType="XML" id="ani-order-arrow" attributeName="points" from={from} to={destination} begin="0s" dur="0.2s" repeatCount="1" fill="freeze" />
                </polyline>
                <line className="st-order-arrow" x1="485.67453" y1="145.09268" x2="485.67453" y2="827.75989"/>
            </svg>
        );
    }
    
    return output;
};

export default OrderArrow;