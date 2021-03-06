import React, {useEffect, useState} from "react";
import InfoTooltip from "components/modules/infoTooltip";


const PaperConfidence = function ({filtersList, confidence}) {

    const [localConfidenceArray, setLocalConfidenceArray] = useState([]);

    useEffect(() => {
        let mnt = true;

        //I combine two arrays in an array of pairs: from [a,b,c] and [1,2,3] to [{a,1}, {b,2}, {c,3}]
        function pairCoupleArray(confArray,filterArray){
            let pairArray = [];
            let min_length = (confArray.length < filterArray.length) ? confArray.length : filterArray.length;
            for(let i = 0; i < min_length; i++){
                //in case the 2 array filters are in the same order
                if(confArray[i].id === filterArray[i].id){
                    pairArray.push({"label" : filterArray[i].data.name, "tooltip" : filterArray[i].data.predicate, "value" : confArray[i].filterValue});
                }
                //otherwise I need to search for the correct pair
                else{
                    let correctFilter = filterArray.find(filter => filter.id === confArray[i].id);
                    if(correctFilter && correctFilter.data){
                        pairArray.push({"label" : correctFilter.data.name, "tooltip" : correctFilter.data.predicate, "value" : confArray[i].filterValue});
                    }
                }
            }
            return pairArray;
        }

        console.log(confidence);

        if(filtersList.length !== 0 && confidence !== undefined){
            setLocalConfidenceArray(pairCoupleArray(confidence.filters, filtersList));
        }

        return () => {
            mnt = false;
        };
    }, [])

    

    let output = <p>add filters in order to check partial confidence of each filter</p>;

    if(localConfidenceArray.length !== 0){
        output = (
            <>
                {localConfidenceArray.map((element, index) => 
                    <p key={index} title={element.tooltip}>
                        <span>{element.label}</span> <span className="side-detail">{(element.value) ? element.value.toFixed(2) : "−.−−"}</span>
                    </p>
                )}
            </>
        );
    }else{
        output = (<>This paper has not received any confidence score yet</>);
    }

    return (
        <div className="side-info-wrapper">
        <div className="side-info">
                <div className="confidence">
                    {(confidence) ? parseFloat(confidence.value).toFixed(2) : "−.−−"}
                </div>
                <InfoTooltip className={"filters-confidence"}>
                    {output}
                </InfoTooltip>
                
            </div>
        </div>
    );

};

export default PaperConfidence;