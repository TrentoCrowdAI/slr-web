import React, {useState} from "react";
import InfoIcon from "components/svg/infoIcon";


const PaperConfidence = function ({filtersList, confidence}) {

    const [displayDetails, setDisplayDetails] = useState(false)

    //I combine two arrays in an array of pairs: from [a,b,c] and [1,2,3] to [{a,1}, {b,2}, {c,3}]
    function pairCoupleArray(confArray,filterArray){
        let pairArray = [];
        for(let i = 0; i < confArray.length; i++){
            //in case the 2 array filters are in the same order
            if(confArray[i].detail === filterArray[i].data.name){
                pairArray.push({"label" : confArray[i].detail, "tooltip" : filterArray[i].data.predicate});
            }
            //otherwise I need to search for the correct pair
            else{
                pairArray.push({"label" : confArray[i].detail, "tooltip" : filterArray.find(filter => filter.data.predicate === confArray[i].detail)});
            }
        }
    }

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