import React, {useEffect, useContext, useState} from "react";

import FilterCard from "./filterCard";
import NoFilters from "components/svg/noFilters";

import {AppContext} from 'components/providers/appProvider';
import {projectFiltersDao} from 'dao/projectFilters.dao';

const PrintFiltersList = function ({filtersList, setFiltersList, project_id}) {

    //boolean flag for handling mount status
    const [mounted, setMounted] = useState(true);

    //get data from global context
    const appConsumer = useContext(AppContext);

    let yup = require('yup');

    //effect for setting mount status to false when unmounting
    useEffect(() => {
        return () => {
            setMounted(false);
        };
    }, [])
    
    //function to delete filter and update the list
    async function deleteFilter(id){
        console.log("deleting " + id);
            
        //call the dao
        let res = await projectFiltersDao.deleteFilter(id);

        //error checking
        //if is other error
        if (mounted && res.message) {
            //pass error object to global context
            appConsumer.setError(res);
        }
        //if res isn't null
        else if (mounted && res !== null) {

            appConsumer.setNotificationMessage("Successfully deleted");
            let newFiltersList = filtersList.filter((filter)=>filter.id !== id);
            //update project list state
            setFiltersList(newFiltersList);
        }
    }

    let output = "";
    //if list is empty, print a notice message
    if (filtersList.length === 0) {
        output = (
            <div className="empty-list-wrapper empty-filters"> <NoFilters/> 
            <p className="empty-list-description"> There are no filters here, you can add new ones by filling the form to the right</p></div>
        );
    }
    //if list isn't empty, print list of papers
    else if(mounted){
        output = (
            <>
            {filtersList.map((element) =>
                <div key={element.id} className="generic-card filter-card">
                    <FilterCard project_id={project_id} filter={element} filtersList={filtersList} callDelete={deleteFilter} yup={yup}/>
                </div>
            )}
            </>
        );
    }
    return output;


};

export default PrintFiltersList;