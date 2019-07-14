import React, {useState, useEffect} from "react";

import SideOptions from 'components/modules/sideOptions';
import UpdateFilterForm from "./forms/updateFilterForm";



const FilterCard = function ({project_id, filter, callDelete, yup}) {

    //local copy of the filter to manage on the card and update form
    const [localFilter, setLocalFilter] = useState(filter)

    //bool to disable card while doing delete call
    const [disabled, setDisabled] = useState(false);

    //bool to display the edit form
    const [editing, setEditing] = useState(false);

    //side options
    let sideOptions= ["delete", "update"];

    //handle for the side options
    function handleSideOptions(id, name){
        if(name === "delete"){
            setDisabled(true);
            callDelete(id);
        }
        else if(name === "update"){
            setEditing(true);
        }
    }

    let output;

    if(editing){
        output = (
            <UpdateFilterForm project_id={project_id} filter={localFilter} setFilter={setLocalFilter} yup={yup} setEditing={setEditing}/>
        );
    }
    else{
        output = (
            <div className={(disabled) ? "disabled" : ""}>
                <SideOptions options={sideOptions} handler={handleSideOptions} target={localFilter.id} cls="card-options"/>
                <h3><span className="filter-label">{localFilter.data.name}</span> {localFilter.data.predicate}</h3>
                <div className="answer"><p><span><span>Include</span><span>:</span></span> {localFilter.data.inclusion_description || <i>empty criterion</i>}</p></div>
                <div className="answer"><p><span><span>Exclude</span><span>:</span></span> {localFilter.data.exclusion_description || <i>empty criterion</i>}</p></div>
            </div>
        );
    }

    return output;

};

export default FilterCard;