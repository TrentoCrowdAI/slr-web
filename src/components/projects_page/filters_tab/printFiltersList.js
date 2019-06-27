import React from "react";

import NoPapers from "components/svg/noPapers";

import FilterCard from "./filterCard";

const PrintFiltersList = function ({filtersList}) {

    let yup = require('yup');

    let output;
    //if list is empty, print a notice message
    if (filtersList.length === 0) {
        output = (
            <div className="empty-project-wrapper"> <NoPapers/> <p className="empty-project-description"> There are no filters here, you can add new ones by searching </p></div>
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