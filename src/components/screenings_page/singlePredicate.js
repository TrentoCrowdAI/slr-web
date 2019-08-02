import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from 'react-router-dom';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import {projectScreeningDao} from 'dao/projectScreening.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'


import FiltersAccordion from "components/modules/filtersAccordion";
import Tags from 'components/modules/paperTags';
import HighLighter from 'components/modules/highlighter';
import InfoTooltip from "components/modules/infoTooltip";
import PositiveAnswer from 'components/svg/positiveAnswer';
import NegativeAnswer from 'components/svg/negativeAnswer';
import UndecidedAnswer from 'components/svg/undecidedAnswer';
import HLoad from "components/svg/hLoad";


const _array = require('lodash/array');

/**
 * single-predicate screening page
 * */

const SinglePredicateScreening = function ({screening, filtersList}) {

    const mountRef = useRef(false);

    //paper to screen
    const [paperData, setPaperData] = useState(undefined);

    //paper wrapper-height js animation
    const [paperHeight, setPaperHeight] = useState(220)

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //decision variable
    const [decision, setDecision] = useState("");

    //highlighted data
    const [highlightedData, setHighlightedData] = useState(undefined);

    //selected tags
    const [selectedTags, setSelectedTags] = useState([]);

    //available tags (there's no need to re-render the page when these changes because they're hidden, that's why I use useRef)
    const availableTags = useRef(screening.data.tags);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //bool to trigger next paper fetch
    const [nextPaper, setNextPaper] = useState(false);

    //bool for vote submission
    const [voteSubmission, setVoteSubmission] = useState(false);

    //component lifecycle hook
    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    //this will run on mount and every time the user votes a paper so we ask for a new one to vote
    useEffect(() => {

        //flag that represents the state of component
        let mnt = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //I hide the page
            setDisplay(false);

            //I reset decision and selected tags
            setDecision("");
            availableTags.current = _array.union(availableTags.current, selectedTags);
            setSelectedTags([]);

            //call dao for getting next paper
            let res = await projectScreeningDao.getProjectPaperToScreen(screening.id);

            //error checking
            //if the component is still mounted and  is 404 error it means there are no more papers to screen
            if (mnt && res && res.message === "Not Found") {

                //I create a 'fake' paper data so the user knows he's done 
                setPaperData({data: {title:"Finished!", 
                    abstract:(
                        <>There are no more papers to screen in this project<br/>
                            <Link to={"/screenings"}>Go back to screenings list</Link>
                        </>
                        )}});
                //show the page
                setDisplay(true);
            }
            //if the component is still mounted and  there are some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mnt && res) {
                //set paper data
                setPaperData(res);
                //set text to not be highlighted at first
                setHighlightedData([{data: res.data.abstract, start: 0, end: res.data.abstract.length-1, type:"not_highlighted"}])

                //show the page
                setDisplay(true);
                //submission flag set to false, once the page is displayed the user still needs to submit data
                setVoteSubmission(false);
            }

        };


        fetchData();
        

        //when the component will unmount or the useEffect will finish
        return () => {
            //set flag as unmounted
            mnt = false;
        };

    }, [screening, nextPaper]);  //re-execute when these variables change

    //effect for updating the paper wrapper height once it's displayed
    useEffect(() =>{
        if(display){
            setPaperHeight(document.getElementsByClassName('s-paper')[0].clientHeight+20);
        }
    }, [display])

    //function for submitting the vote
    async function sendSubmission(key) {

        //I create the basic submission data with the highlights included
        let screeningData = {
            project_paper_id: paperData.id,
            vote:{
                answer: "0",
                metadata: {type: "single-predicate", highlights: highlightedData, tags: selectedTags}
            }
        };

        //switch-case for the vote
        switch (key) {
            case "s":
                console.log("NO");
                setDecision("no");
                break;
            case "a":
                console.log("YES");
                setDecision("yes");
                screeningData.vote.answer = "1";
                break;
            case "d":
                console.log("UND");
                setDecision("und");
                screeningData.vote.answer = "2";
                break;
            default:
                break;
        }
        console.log("data to send _> ");
        console.log(screeningData)
        
        //I update the flag for the vote submission
        setVoteSubmission(true);
        //call the dao
        let res = await projectScreeningDao.submitVote(screeningData);
        
        //if no error
        if(mountRef.current && res.data){
            //I trigger the effect to get a new paper
            setNextPaper(!nextPaper);
        }   
        //error checking
        //if is other error
        else if (mountRef.current && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);  
        }
        
    }
    
    //wrapper function for the vote submission in order to stop submission if necessary
    function handleKey(key){
        //I check if I'm not in a textfiled and display and voteSubmission flags
        if(document.activeElement.type !== "text" && display && !voteSubmission){
            sendSubmission(key);
        }
    }

    //part of the page
    let resultPart = <></>;
    let paperToDisplay = <></>;
    let formPart = <></>;

    //if there's a paper to display
    if(paperData && paperData.data && paperData.data.title!=="Finished!"){

        //I create the form
        formPart = (
            <form className="light-modal screening-outcome">

                <InfoTooltip className={"s-p-form"}>
                    You can cast your vote by using the keyboard:<br/>
                    <b>A : </b> <i>yes</i><br/>
                    <b>S : </b> <i>no</i><br/>
                    <b>D : </b> <i>undecided</i><br/>
                </InfoTooltip>
                <h2 className="question">Is the paper relevant to the review?</h2>
                <p className="hl-tip">Please highlight in the text the evidence that supports your answer</p>

                <div className="vote-submission-load">
                    {(voteSubmission) ? <HLoad className={"delayed"}/> : <></>}
                </div>

                <div className="screening-choice">
                    <div className="yes-no-und">
                        <div className="btn-decision-holder">
                            <button className="yes" style={{backgroundColor: (decision === "yes") ? "#0b8a42" : ""}}
                                onClick={() => {handleKey("a")}}
                            >
                                <PositiveAnswer color={(decision === "yes") ? "white" : "#696969"}/>
                            </button>
                            <div className="decision-tooltip">yes</div>
                        </div>
                        <div className="btn-decision-holder">
                            <button className="no" style={{backgroundColor: (decision === "no") ? "#c31f1f" : ""}}
                                onClick={() => {handleKey("s")}}
                            >
                                <NegativeAnswer color={(decision === "no") ? "white" : "#696969"}/>
                            </button>
                            <div className="decision-tooltip">no</div>
                        </div>
                        <div className="btn-decision-holder">
                            <button className="und" style={{backgroundColor: (decision === "und") ? "#4242e1" : ""}}
                                onClick={() => {handleKey("d")}}
                            >
                                <UndecidedAnswer color={(decision === "und") ? "white" : "#696969"}/>
                            </button>
                            <div className="decision-tooltip">undecided</div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    //if display is false (because I'm fetching data)
    if(display === false){
        //the paper to display will simply contain a loading icon
        paperToDisplay = <LoadIcon class="small"/>
    }
    //else if there's a paper
    else if (paperData.data){
        paperToDisplay = (
            <>
                <h2 className="paper-title">{paperData.data.title}</h2>

                <HighLighter data={paperData.data.abstract} disabled={paperData.data.title==="Finished!"} /* I disable the highlighter if the paper is the fake one telling the use he has finished*/
                    className={"paragraph"} 
                    highlightedData={highlightedData} setHighlightedData={setHighlightedData}
                />
            </>
        )
    }

    //I create the resulting page to display
    resultPart = (
        <>
            {/*add keyboard handler to deal with keayboard commands */}
            <KeyboardEventHandler handleKeys={['a', 's', 'd']}  handleFocusableElements onKeyEvent={(key) => handleKey(key)} />
            <div className="right-side-wrapper filters">
                <h2>Filters:</h2>
                <FiltersAccordion filtersList={filtersList}/>
            </div>

            {/*div wrapper to set height animation*/}
            <div style={{height: paperHeight+"px",overflow:"hidden", transition: "all 0.5s linear"}}>
                {/*content of the animated div*/}
                <div className="left-side-wrapper s-paper">
                    {paperToDisplay}
                </div>
            </div>

            <div style={{display: (paperData && paperData.data && paperData.data.title==="Finished!") ? "none" : ""}}>
                <Tags display={display} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                    availableTags={availableTags}
                />
            </div>

            {formPart}
        </>
    );




    let output = (
        <>
            <div className="single-predicate-screening-wrapper">
                {resultPart}
            </div>
        </>
    );

    return output;
};


export default SinglePredicateScreening;