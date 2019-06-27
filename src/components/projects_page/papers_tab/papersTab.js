import React, {useState} from "react";
import { Link } from 'react-router-dom';

import PapersList from 'components/projects_page/papers_tab/papersList';
import ProjectDescription from 'components/projects_page/papers_tab/projectDescription';
import {join} from 'utils';

import Cover from "components/modules/cover";
import PapersCsvForm from "components/projects_page/papers_tab/forms/papersCsvForm";


/**
 * this is the paper tab which will call the other components
 */
const PapersTab = function (props) {

    //bool to control visualization of form
    const [displayCsvForm, setDisplayCsvForm] = useState(false);

    return (
        <>
            <Cover cls={displayCsvForm ? "full-screen" : ""} handler={setDisplayCsvForm}/>
            <PapersCsvForm visibility={displayCsvForm} setVisibility={setDisplayCsvForm} projectId={props.project_id}/>
            <ProjectDescription project_id={props.project_id} description={props.project.data.description} update={props.updateProject} date_last_modified={props.project.date_last_modified} date_created={props.project.date_created} collaborators={props.collaborators} setCollaborators={props.setCollaborators}/>
            <PapersList project_id={props.project_id} location={props.location} match={props.match} history={props.history}/>
            <div className="bottom-right-button-holder">
                <div>
                    <button className="bottom-right-btn add-csv-papers-btn" type="button" value="toggle-insert-form" 
                    onClick={(e) => {
                        setDisplayCsvForm(!displayCsvForm);
                    }}>
                        <div className="btn-title">Upload .csv papers</div><div className="btn-icon"> </div>
                    </button>
                </div>
                <div>
                    <Link to={join(props.match.url,"/addpaper")}>
                        <button className="bottom-right-btn add-custompaper-btn">
                            <div className="btn-title">Add Custom Paper</div><div className="btn-icon"> </div>
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default PapersTab;