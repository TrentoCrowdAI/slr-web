import React from "react";
import Ghost from "components/svg/ghost";



/**
 * 404 page
 */
const PageNotFound = function (props) {
    //get data from global context
    return (
        <div className="page-not-found-wrapper">
            <Ghost/>
        </div>
    );
};

export default PageNotFound;