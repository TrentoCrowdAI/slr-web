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

    //paper fetch toggler (its value will be toggled and it will trigger the useEffect fetching papers)
    const [forcePapersFetch, setForcePapersFetch] = useState(false);

    return (
        <>
            <Cover cls={displayCsvForm ? "full-screen" : ""} handler={setDisplayCsvForm}/>
            <PapersCsvForm visibility={displayCsvForm} setVisibility={setDisplayCsvForm} project_id={props.project_id}
                forcePapersFetch={forcePapersFetch} setForcePapersFetch={setForcePapersFetch}
            />
            <ProjectDescription project={props.project} setProject={props.setProject} collaborators={props.collaborators} setCollaborators={props.setCollaborators}/>
            <PapersList project_id={props.project_id} location={props.location} match={props.match} history={props.history}
                forcePapersFetch={forcePapersFetch}
            />
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