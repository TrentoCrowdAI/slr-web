import React, {useState, useEffect} from "react";
import PlusIcon from "components/svg/plusIcon";

const FiltersAccordion = function ({filtersList}) {


    let output = "";
    //if list is empty, print a notice message
    if (filtersList.length === 0) {
        output = (
            <p className="empty-list-description"> There are no filters here, you can add new ones by filling the form to the right</p>
        );
    }
    //if list isn't empty, print list of papers
    else{
        output = (
            <div className="filters-list">
                {filtersList.map((element) =>
                    <div key={element.id} className="filter">
                        <FilterElement filter={element.data} code={parseInt(element.id)}/>
                    </div>
                )}
            </div>
        );
    }
    return output;


};

const FilterElement = function({filter, code}) {

    //state for showinf inclusion/exclusion criteria
    const [isOpen, setIsOpen] = useState(false);

    function handleFocus(){
        //handle arrow animation and focus of menu
        document.getElementById((isNaN(code)) ? "ani-plus-icon-y1" : "ani-plus-icon-y1" + code).beginElement();//trigger svg animation
        document.getElementById((isNaN(code)) ? "ani-plus-icon-y2" : "ani-plus-icon-y2" + code).beginElement();//trigger svg animation
    }

    return(
        <>
            <button className="filter-title" onClick={() => {handleFocus();setIsOpen(!isOpen)}}>
                <span>{filter.predicate}</span> <PlusIcon focused={isOpen} code={code}/>
            </button>
            <div className="filter-data" style={{maxHeight: (isOpen) ? "300px" : "0px"}}>
                <p className="criteria-type">
                    inclusion criteria:
                </p>
                <p className="criteria-description">
                    {filter.inclusion_description}
                </p>
                <p className="criteria-type">
                    exclusion criteria:
                </p>
                <p className="criteria-description">
                    {filter.exclusion_description}
                </p>
            </div>
        </>
    )
};

export default FiltersAccordion;