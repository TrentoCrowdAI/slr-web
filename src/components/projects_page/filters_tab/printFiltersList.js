import React from "react";

import FilterCard from "./filterCard";
import NoFilters from "components/svg/noFilters";

const PrintFiltersList = function ({filtersList}) {

    let yup = require('yup');

    let output;
    //if list is empty, print a notice message
    if (filtersList.length === 0) {
        output = (
            <div className="empty-list-wrapper empty-filters"> <NoFilters/> 
            <p className="empty-list-description"> There are no filters here, you can add new ones by filling the form to the right</p></div>
        );
    }
    //if list isn't empty, print list of papers
    else {
        output = (
            <>
            {filtersList.map((element) =>
                <div key={element.id} className="generic-card filter-card">
                    <FilterCard filter={element} yup={yup}/>
                </div>
            )}
            </>
        );
    }
    return output;


};

export default PrintFiltersList;