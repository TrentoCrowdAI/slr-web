import React, {useState} from "react";
import {Link} from 'react-router-dom';

import SideOptions from 'components/modules/sideOptions';
import {join} from 'utils';


const ProjectCard = function ({callDelete, path, project}) {

    const [disabled, setDisabled] = useState(false);

    //side options
    let sideOptions= ["delete"];

    //handle for the side options
    function handleSideOptions(id, name){
        if(name === "delete"){
            setDisabled(true);
            callDelete(id);
        }
    }
    return(
        <div className={(disabled) ? "disabled" : ""}>
            <SideOptions options={sideOptions} handler={handleSideOptions} target={project.id} cls="card-options project-card-options"/>
                <Link to={join(path, "/" + project.id)}>
                    <h3>{project.data.name}</h3>
                    <p className="description">{project.data.description}</p>
                    <div className="project-dates">
                        <p>{/*created on <i>{project.date_created.slice(0, 10)}</i>*/}</p>
                        <p>last modified on <i>{project.date_last_modified.slice(0, 10)}</i></p> 
                    </div>
                </Link>
        </div>
    )
}

export default ProjectCard;