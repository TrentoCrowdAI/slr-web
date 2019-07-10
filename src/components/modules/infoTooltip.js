import React from "react";
import InfoIcon from "components/svg/infoIcon";


const InfoTooltip = function ({className, content}) {

    return (
        <div className={(className) ? "top-right-anchor " + className : "top-right-anchor"}>
            <div className="information-holder">
                <div className="info-button-icon"><InfoIcon/></div>
                <div className={(className) ? "information-content-wrapper " + className : "information-content-wrapper"}>
                    <div className="information-content">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default InfoTooltip;