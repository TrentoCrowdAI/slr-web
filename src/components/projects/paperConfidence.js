import React, {useState} from "react";
import InfoIcon from "components/svg/infoIcon";


const PaperConfidence = function ({confidence}) {

    const [displayDetails, setDisplayDetails] = useState(false)

    return (
        <div className="side-info-wrapper">
        <div className="side-info">
                <div className="confidence">
                    {confidence.value}
                </div>
                <div className="confidence-info">
                    <button type="button" onClick={(e) => {setDisplayDetails(!displayDetails)}}><InfoIcon></InfoIcon></button>
                    <div className="confidence-details" style={{display: (displayDetails) ? "block" : "none"}}>
                        {confidence.details.map((element, index) => 
                            <p key={index}>
                                <span>{element.detail}</span> <span className="side-detail">{element.percentage}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default PaperConfidence;