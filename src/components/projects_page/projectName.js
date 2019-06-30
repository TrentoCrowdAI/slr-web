import React, {useState,useContext,useEffect, useRef} from "react";

import {projectsDao} from 'dao/projects.dao';
import {AppContext} from 'components/providers/appProvider';

import EditButton from "components/svg/editButton";

/**
 * this is the head component of page
 * @param "menu_elements" contains the list of menu-items
 */


const ProjectName = function({project, setProject}){

    const mountRef = useRef(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //this is used as a toggle for checking if the user is trying to edit the name of the project
    const [editing, setEditing] = useState(false);

    //this is used as field value for the project name
    const [name, setName] = useState(project.data.name);


    //checks if there's an edit request
    function handleEditRequest(e){
        if(!editing){//if the user is not editing the name yet(the check is useful because handleEditRequest and handleConfirm fire at the same time)
            document.getElementById("edit-project-name-input").focus();
            setEditing(!editing);
        }
    }

    //function for updating the description and name
    async function updateProject(){

        //if the new name o description are difference from the old name o description
        if(name !== project.data.name){

            let res = await projectsDao.putProject(project.id, {name: name, description : project.data.description});

            
            //empty string is the response from the dao layer in case of success(rember that empty string is a falsy value)
            if (mountRef.current && res === "") {
                console.log("we got a success");
                let newProject = project;
                newProject.data.name = name;
                setProject({...newProject});
            }
            //error checking
            //if is other error
            else if (mountRef.current && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }

        }
    }

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);


    //checks if the user wants to confirm the change
    function handleConfirm(e){
        if(editing){//if the user was editing I confirm its request and call the api(the check is useful because handleEditRequest and handleConfirm fire at the same time)
            updateProject();
            setEditing(!editing);
        }
    }

    return(
        <div className={(editing) ? "nav-elements" : "nav-elements hidden-form"}> 
            <h2 style={{fontSize: (editing) ? "0px" : "21px"}}>{project.data.name}</h2> 
            {/*clicking on the div containing the title will allow the user to access the form for editing the project name*/}
            <form className="edit-project-name"  onClick={handleEditRequest} onSubmit={(e) => {e.preventDefault()}}>
                <input type="text" id="edit-project-name-input" value={name} style={{width: (editing) ? "" : "0px", padding: (editing) ? "" : "0px"}}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={(e) => {setEditing(false)}}
                />
                <button className="edit-button" onMouseDown={handleConfirm} type="button"><EditButton confirm={editing}/></button>
                {/*clicking on the button will confirm the new name*/}
            </form>
        </div>
    );
}

export default ProjectName;