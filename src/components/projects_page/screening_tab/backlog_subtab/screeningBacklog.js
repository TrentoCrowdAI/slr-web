import React, {useState, useEffect, useRef} from "react";
import { Link } from 'react-router-dom';

import PapersList from 'components/projects_page/papers_tab/papersList';
import ProjectDescription from 'components/projects_page/papers_tab/projectDescription';
import {join} from 'utils';

import BacklogPapers from 'components/projects_page/screening_tab/backlog_subtab/backlogPapers';

import AutoScreeningForm from 'components/projects_page/screening_tab/backlog_subtab/forms/autoScreeningForm';
import Cover from "components/modules/cover";


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

    useEffect(() => {
        let mnt = true;
        /*
        //call the dao for getting the filters
        let res = await projectFiltersDao.getFiltersList({"project_id" : project_id});

        //error checking
        //if the component is still mounted and  is 404 error
        if (mnt && res && res.message === "Not Active") {
            //setAutoScreeningFlag(false);
        }
        //if the component is still mounted and  there are some other errors
        else if (mnt && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);
        }
        //if the component is still mounted and  res isn't null
        else if (mnt && res) {
            //update state
            setAutoScreeningFlag(true);
        }
        */
        
        return () => {
            console.log("clearing main");
            mnt = false;
        };
    },[]);

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

    return (
        <>
            <Cover cls={displayManualForm ? "full-screen" : ""} handler={setDisplayManualForm}/>
            <Cover cls={displayAutoForm ? "full-screen" : ""} handler={setDisplayAutoForm}/>
            <AutoScreeningForm visibility={displayAutoForm} setVisibility={setDisplayAutoForm} project_id={project_id} setAutoScreeningFlag={setAutoScreeningFlag}/>
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
                    <div className="screening-strategy-btn-holder">
                        <button className="screening-strategy-btn manual" type="button"
                            onClick={() => {setDisplayAutoForm(true)}}
                        > 
                        </button>
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
                        </button>
                    </div>
                    <div className="screening-strategy-btn-holder">
                        <button className="screening-strategy-btn crowdsource" type="button"> 
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ScreeningBacklog;