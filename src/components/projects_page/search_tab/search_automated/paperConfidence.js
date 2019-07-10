import React, {useState} from "react";
import InfoTooltip from "components/modules/infoTooltip";


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
                <InfoTooltip className={"filters-confidence"} content={(<>
                        {confidence.details.map((element, index) => 
                            <p key={index}>
                                <span>{element.detail}</span> <span className="side-detail">{element.percentage}</span>
                            </p>
                        )}
                    </>)}/>
                
            </div>
        </div>
    );

};

export default PaperConfidence;