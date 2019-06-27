import React, {useContext, useState, useEffect} from "react";

import SideOptions from 'components/modules/sideOptions';
import {AppContext} from 'components/providers/appProvider';
import UpdateFilterForm from "./forms/updateFilterForm";


const FilterCard = function ({filter, yup}) {

    //boolean flag for handling mount status
    let mounted = true;

    //local copy of the filter to manage on the card and update form
    const [localFilter, setLocalFilter] = useState(filter)

    //bool to display the card and remove it in case of successful delete
    const [display, setDisplay] = useState(true);

    //bool to display the edit form
    const [editing, setEditing] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //side options
    let sideOptions= ["delete", "update"];

    //effect for setting mount status to false when unmounting
    useEffect(() => {
        return () => {
            mounted = false;
        };
    }, [])

    //handle for the side options
    async function handleSideOptions(id, name){
        if(name === "delete"){
            console.log("deleting " + id);
            //call the dao
            //let res = await projectPapersDao.deletePaper(id);

            /*
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
                setFiltersList(newFiltersList);
            }
            */
           setDisplay(false);
        }
        else if(name === "update"){
            setEditing(true);
        }
    }

    let output;

    if(display && editing){
        output = (
            <UpdateFilterForm filter={localFilter} setFilter={setLocalFilter} yup={yup} setEditing={setEditing}/>
        );
    }
    else if(display){
        output = (
            <>
                <SideOptions options={sideOptions} handler={handleSideOptions} target={localFilter.id} cls="card-options"/>
                <h3>{localFilter.id}) {localFilter.predicate}</h3>
                <div className="answer"><p><span><span>Include</span><span>:</span></span> {localFilter.should}</p></div>
                <div className="answer"><p><span><span>Exclude</span><span>:</span></span> {localFilter.shouldNot}</p></div>
            </>
        );
    }else{
        output = <></>;
    }

    return output;

};

export default FilterCard;