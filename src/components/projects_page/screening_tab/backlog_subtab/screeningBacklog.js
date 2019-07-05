import React, {useState} from "react";
import { Link } from 'react-router-dom';

import PapersList from 'components/projects_page/papers_tab/papersList';
import ProjectDescription from 'components/projects_page/papers_tab/projectDescription';
import {join} from 'utils';

import BacklogPapers from 'components/projects_page/screening_tab/backlog_subtab/backlogPapers';

import Cover from "components/modules/cover";


/**
 * this is the screening sub-tab
 */
const ScreeningBacklog = function ({project_id}) {

    //bool to control visualization of form
    const [displayManualForm, setDisplayManualForm] = useState(false);

    //bool to control visualization of form
    const [displayAutoForm, setDisplayAutoForm] = useState(false);

    //paper fetch toggler (its value will be toggled and it will trigger the useEffect fetching papers)
    const [forcePapersFetch, setForcePapersFetch] = useState(false);

    return (
        <>
            <Cover cls={false ? "full-screen" : ""} handler={setDisplayManualForm}/>
            {/*
            <PapersCsvForm visibility={displayCsvForm} setVisibility={setDisplayCsvForm} project_id={props.project_id}
                forcePapersFetch={forcePapersFetch} setForcePapersFetch={setForcePapersFetch}
            />
            */}
            <BacklogPapers project_id={project_id}/>
            <div className="bottom-right-screening-strategy-box">
                <h3>
                    Screening strategy
                </h3>
                <div className="screening-strategy-buttons">
                    <button className="screening-strategy-btn manual" type="button"> 
                    </button>
                    <button className="screening-strategy-btn auto" type="button"> 
                    </button>
                    <button className="screening-strategy-btn crowdsource" type="button"> 
                    </button>
                </div>
            </div>
        </>
    );
}

export default ScreeningBacklog;