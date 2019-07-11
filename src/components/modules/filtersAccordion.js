import React, {useState, useEffect} from "react";
import PlusIcon from "components/svg/plusIcon";

const FiltersAccordion = function ({filtersList}) {

    const [isOpen, setIsOpen] = useState(filtersList.map((x) => (false)));

    let output = "";
    //if list is empty, print a notice message
    if (filtersList.length === 0) {
        output = (
            <p className="empty-filters-list-description"> There are no filters in this project</p>
        );
    }
    //if list isn't empty, print list of papers
    else{
        output = (
            <div className="filters-list">
                {filtersList.map((element, index) =>
                    <div key={element.id} className="filter">
                        <FilterElement filter={element.data} code={parseInt(element.id)} isOpen={isOpen} setIsOpen={setIsOpen} index={index}/>
                    </div>
                )}
            </div>
        );
    }
    return output;


};

const FilterElement = function({filter, code, isOpen, setIsOpen, index}) {

    function handleFocus(){
        //handle arrow animation and focus of menu
        document.getElementById((isNaN(code)) ? "ani-plus-icon-y1" : "ani-plus-icon-y1" + code).beginElement();//trigger svg animation
        document.getElementById((isNaN(code)) ? "ani-plus-icon-y2" : "ani-plus-icon-y2" + code).beginElement();//trigger svg animation
    }
    function handleFilterClick(){
        handleFocus();
        let localOpen = isOpen.map((x) => false);
        localOpen[index] = !isOpen[index];
        setIsOpen([...localOpen]);
    }
    return(
        <>
            <button className="filter-title" onClick={handleFilterClick}>
                <span>{filter.predicate}</span> <PlusIcon focused={isOpen[index]} code={code}/>
            </button>
            <div className="filter-data" style={{maxHeight: (isOpen[index]) ? "300px" : "0px"}}>
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