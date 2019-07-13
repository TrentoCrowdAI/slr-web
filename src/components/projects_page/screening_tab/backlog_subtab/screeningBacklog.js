import React, {useState, useEffect, useRef} from "react";
import { Link } from 'react-router-dom';

import PapersList from 'components/projects_page/papers_tab/papersList';
import ProjectDescription from 'components/projects_page/papers_tab/projectDescription';
import {join} from 'utils';

import BacklogPapers from 'components/projects_page/screening_tab/backlog_subtab/backlogPapers';

import AutoScreeningForm from 'components/projects_page/screening_tab/backlog_subtab/forms/autoScreeningForm';
import ManualScreeningForm from 'components/projects_page/screening_tab/backlog_subtab/forms/manualScreeningForm';
import Cover from "components/modules/cover";
import ManualScreeningIcon from "components/svg/manualScreningIcon";
import AutoScreeningIcon from "components/svg/autoScreeningIcon";
import CrowdScreeningIcon from "components/svg/crowdScreeningIcon";


/**
 * this is the screening sub-tab
 */
const ScreeningBacklog = function ({project_id}) {

    //bool to control visualization of form
    const [displayManualForm, setDisplayManualForm] = useState(false);

    //bool to control visualization of form
    const [displayAutoForm, setDisplayAutoForm] = useState(false);

    //autoScreening flag
    const [autoScreeningFlag, setAutoScreeningFlag] = useState(false);

    //autoScreeningStatus
    const [autoScreeningStatus, setAutoScreeningStatus] = useState(3016);

    //number of papers hooks, used to check if there are papers
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        let res = 0;
        let mnt = true;
        let poll = undefined;
        console.log("checking if need to poll")
        
        if(autoScreeningFlag){
            poll = setInterval(() => {
                console.log("POLLING....");
                setAutoScreeningStatus(3016-3016*res/100)
                res++;

            }, 1000);
        }

        return () => {
            console.log("clearing polling");
            mnt = false;
            clearInterval(poll);
        };
    },[autoScreeningFlag]);

    let screeningStrategy = <></>;
    if(totalResults !== 0){
        screeningStrategy = (
            <div className="bottom-right-screening-strategy-box">
                <h3>
                    Screening strategy
                </h3>
                <div className="screening-strategy-buttons">
                    <div className="screening-strategy-btn-holder">
                        <button className="screening-strategy-btn manual" type="button"
                            onClick={() => {setDisplayManualForm(true)}}
                        > 
                        <ManualScreeningIcon/>
                        </button>
                        <div className="strategy-tooltip">
                            manual
                        </div>
                    </div>
                    <div className="screening-strategy-btn-holder">
                        <svg id="circle-progress"
                            version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 1000 1000">
                            <ellipse fill="none" stroke="#0b8a42" strokeWidth="30" cx="500" cy="500" rx="480" ry="480"
                                style={{strokeDasharray: "3016", strokeDashoffset: autoScreeningStatus, transition: "all 0.2s"}}
                            />
                        </svg>
                        <button className="screening-strategy-btn auto" type="button"
                            onClick={() => {setDisplayAutoForm(true)}}
                        > 
                        <AutoScreeningIcon/>
                        </button>
                        <div className="strategy-tooltip">
                            automatic
                        </div>
                    </div>
                    <div className="screening-strategy-btn-holder">
                        <button className="screening-strategy-btn crowdsource" type="button"> 
                        <CrowdScreeningIcon/>
                        </button>
                        <div className="strategy-tooltip">
                            crowdsourced
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>

            <Cover cls={displayManualForm ? "full-screen" : ""} handler={setDisplayManualForm}/>
            <ManualScreeningForm visibility={displayManualForm} setVisibility={setDisplayManualForm} project_id={project_id}/>
            
            <Cover cls={displayAutoForm ? "full-screen" : ""} handler={setDisplayAutoForm}/>
            <AutoScreeningForm visibility={displayAutoForm} setVisibility={setDisplayAutoForm} project_id={project_id} setAutoScreeningFlag={setAutoScreeningFlag}/>

            <BacklogPapers project_id={project_id}
                totalResults={totalResults} setTotalResults={setTotalResults} //I pass this hook so I will know how much papers are ther
            />
            {screeningStrategy}
        </>
    );
}

export default ScreeningBacklog;