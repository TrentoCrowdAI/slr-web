import React, {useState, useContext, useEffect} from "react";

import {projectsDao} from 'dao/projects.dao';
import {AppContext} from 'components/providers/appProvider'

import EditButton from "components/svg/editButton";
import RemoveButton from "components/svg/removeButton";
import LoadIcon from 'components/svg/loadIcon';

/**
 * this is the description component for the project page
 */


const ProjectDescription = function({project_id, description, update, date_last_modified, date_created, collaborators, setCollaborators}){


    //this is used as a toggle for checking if the user is trying to edit the name of the project
    const [editing, setEditing] = useState(false);

    //form input
    const [input, setInput] = useState("");

    //flag for collaborators loading
    const [loadIconDisplay, setLoadIconDisplay] = useState(true);

    //get data from global context
    const appConsumer = useContext(AppContext);

    let output = <></>;

    //boolean flag for handling hooks
    let mounted = true;

    useEffect(() => {

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //call the dao for getting collaborators
            let res = await projectsDao.getProjectCollaborators(project_id);

            //error checking
            //if the component is still mounted and there is some other errors
            if (mounted && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mounted && res ) {
                setCollaborators(res);
                //show the page
                setLoadIconDisplay(false);
            }
        }

        fetchData();

        return () => {
            mounted = false;
        };
    }, [])

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

    //function for removing collaborators
    async function removeCollaborator(collaborator){
        console.log("removing " + collaborator + " from " + project_id);

        const callApi = async () => {

            //call the dao for getting collaborators
            let res = await projectsDao.removeProjectCollaborator(project_id, collaborator);
            //error checking
            //if the component is still mounted and there is some other errors
            if (mounted && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and didn't get an error
            else if (mounted) {
                let newCollabs = collaborators.filter(x => x.id !== collaborator);
                console.log(newCollabs)
                setCollaborators(newCollabs);
            }
        }
        callApi();
    }

    //function for adding collaborator
    //function for removing collaborators
    async function addCollaborator(){
        if(!collaborators.includes(input)){
            console.log("adding " + input);

            const callApi = async () => {

                //call the dao for getting collaborators
                let res = await projectsDao.addProjectCollaborator(project_id, {"email": input});
                //error checking
                //if the component is still mounted and there is some other errors
                if (mounted && res && res.message) {
                    //pass error object to global context
                    appConsumer.setError(res);
                }
                //if the component is still mounted and didn't get an error
                else if (mounted && res) {
                    setInput("");
                    setCollaborators([...collaborators, res]);
                }
            }
            callApi();
        }
    }


    if(loadIconDisplay){
        output = (
            <div className="project-description hidden-form-description">
                <h2>Description:</h2>
                <LoadIcon/>
            </div>
            );
    }else{
        output = (
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
                <h2>Collaborators:</h2>
                {(collaborators.length === 0) ? "You're not sharing this project with anyone" : ""}
                {collaborators.map((element, index) =>
                    <div className="collaborator-wrapper" key={index}>
                        <p className="collaborator">{element.data.email}</p>
                        <button type="button" className="remove-btn" name={element.data.email}
                            value={element.data.email} //name and value don't work on the button event for some reasons
                            onClick={(e) => {
                                removeCollaborator(element.id);
                            }}>
                            <RemoveButton/>
                        </button>
                    </div>
                )}
                <form className="add-collaborator" onSubmit={addCollaborator}>
                    <input type="text" id="edit-project-description-input" placeholder="add a collaborator" value={input}
                        onChange={(e) => {setInput(e.target.value);}}
                    />
                    <button className="add-collaborator-button" disabled={(!input || input === "")}>
                        
                    </button>
                </form>
            </div>
        );
    }

    return output;
}

export default ProjectDescription;