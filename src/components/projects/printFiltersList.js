import React, {useContext, useState, useEffect} from "react";
import ClampLines from 'react-clamp-lines';
import {Link, withRouter} from 'react-router-dom';

import CheckBox from "components/forms/checkbox";
import SideOptions from 'components/modules/sideOptions';
import {projectPapersDao} from 'dao/projectPapers.dao';
import {AppContext} from 'components/providers/appProvider'

import NoPapers from "components/svg/noPapers";

import {join} from 'utils/index';
import Pagination from "components/modules/pagination";
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