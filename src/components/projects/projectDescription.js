import React, {useState} from "react";

import {AppContext} from "components/providers/appProvider";
import EditButton from "components/svg/editButton";

/**
 * this is the description component for the project page
 */


const ProjectDescription = function({description, update, date_last_modified, date_created}){


    //this is used as a toggle for checking if the user is trying to edit the name of the project
    const [editing, setEditing] = useState(false);

    //handles the click on the edit/confirm button
    function handleEditRequest(e){
        console.log("CLICK");
        if(!editing){//if the user was not editing I allow him to edit
            setTimeout(//I wait for the button event to fire before blurring out the textarea
                function(){
                    document.getElementById("edit-project-description-input").focus();
                },100);
            
            setEditing(true);
            console.log(editing)
        }else{//if the user was editing I submit its changes
            update();
        }
    }

    //format the date string
    function formatDate(date){
        return <span className="date">{date.slice(0,10)} at {date.slice(11,19)}</span>
    }


    return (
        <div className={(!editing) ? "project-description hidden-form-description" : "project-description"}>
            <h2>Description:</h2>
            <p style={{fontSize: (editing) ? "0px" : "15px"}}> {description}</p>
            <form className="edit-project-description" style={{height:(editing) ? "" : "0px"}}>
                    <textarea id="edit-project-description-input"  defaultValue={description} style={{width: (editing) ? "100%" : "0%", padding: (editing) ? "" : "0px", height:(editing) ? "" : "0px"}}
                    onBlur={(e) => {
                                    console.log("blurring");
                                    setEditing(false);
                                }}
                    />
                    <button className="edit-button" onMouseDown={handleEditRequest} type="button">
                        <EditButton confirm={editing}/>
                    </button>
            </form>
            <h2>Additional info:</h2>
            <p className="project-date-info"> <span>Created</span> {formatDate(date_created)} </p>
            <p className="project-date-info"> <span>Last edited</span> {formatDate(date_last_modified)} </p>
        </div>
    );
}

export default ProjectDescription;